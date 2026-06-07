from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import numpy as np
import os

from models import load_models, get_models, INDEX_TO_CLASS, ENSEMBLE_WEIGHTS
from preprocessing import preprocess_image
from gradcam import find_last_conv_layer, make_gradcam_heatmap, overlay_gradcam, image_to_base64


# ── Startup: load models once ──────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up — loading models...")
    load_models()
    print("[OK] Ready")
    yield
    print("Shutting down")

app = FastAPI(
    title="Blood Group Detection API",
    description="Explainable fingerprint-based blood group detection with Grad-CAM",
    version="1.0.0",
    lifespan=lifespan
)

# ── CORS — allow React frontend ────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper: run ensemble ───────────────────────────────────
def run_ensemble(img_batch: np.ndarray) -> tuple:
    mobilenet, resnet, efficientnet = get_models()
    w1, w2, w3 = ENSEMBLE_WEIGHTS

    mob_preds = mobilenet.predict(img_batch, verbose=0)
    res_preds = resnet.predict(img_batch, verbose=0)
    eff_preds = efficientnet.predict(img_batch, verbose=0)

    ensemble_preds = w1 * mob_preds + w2 * res_preds + w3 * eff_preds
    pred_idx       = int(np.argmax(ensemble_preds[0]))
    confidence     = float(ensemble_preds[0][pred_idx])
    top3_idx       = np.argsort(ensemble_preds[0])[::-1][:3]

    top3 = [
        {
            "blood_group": INDEX_TO_CLASS[int(i)],
            "confidence": round(float(ensemble_preds[0][i]) * 100, 2)
        }
        for i in top3_idx
    ]

    return pred_idx, confidence, top3


# ── Routes ─────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "Blood Group Detection API",
        "version": "1.0.0",
        "routes": ["/predict", "/gradcam", "/predict-full", "/health", "/models/info"]
    }


@app.get("/health")
def health():
    mobilenet, resnet, efficientnet = get_models()
    return {
        "status": "healthy",
        "models_loaded": all([
            mobilenet is not None,
            resnet is not None,
            efficientnet is not None
        ])
    }


@app.get("/models/info")
def models_info():
    return {
        "models": [
            {"name": "MobileNetV2",     "size": "14MB",  "params": "3.5M", "role": "ensemble + gradcam"},
            {"name": "ResNet50",        "size": "98MB",  "params": "25M",  "role": "ensemble"},
            {"name": "EfficientNet-B3", "size": "48MB",  "params": "12M",  "role": "ensemble"},
        ],
        "ensemble_weights": {
            "MobileNetV2":     ENSEMBLE_WEIGHTS[0],
            "ResNet50":        ENSEMBLE_WEIGHTS[1],
            "EfficientNet-B3": ENSEMBLE_WEIGHTS[2],
        },
        "ensemble_val_accuracy":  "86.38%",
        "ensemble_test_accuracy": "87.00%",
        "macro_auc":              "0.9895"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/bmp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Upload JPG, PNG or BMP."
        )

    image_bytes         = await file.read()
    img_batch, _        = preprocess_image(image_bytes)
    pred_idx, confidence, top3 = run_ensemble(img_batch)

    return {
        "blood_group": INDEX_TO_CLASS[pred_idx],
        "confidence":  round(confidence * 100, 2),
        "top3":        top3
    }


@app.post("/gradcam")
async def gradcam(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/bmp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Upload JPG, PNG or BMP."
        )

    mobilenet, _, _ = get_models()
    last_conv_layer = find_last_conv_layer(mobilenet)

    image_bytes          = await file.read()
    img_batch, original  = preprocess_image(image_bytes)
    heatmap, pred_idx, _ = make_gradcam_heatmap(img_batch, mobilenet, last_conv_layer)
    overlaid             = overlay_gradcam(original, heatmap)
    heatmap_b64          = image_to_base64(overlaid)

    return {
        "heatmap_image": heatmap_b64,
        "predicted_class": INDEX_TO_CLASS[pred_idx]
    }


@app.post("/predict-full")
async def predict_full(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/bmp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Upload JPG, PNG or BMP."
        )

    mobilenet, _, _  = get_models()
    last_conv_layer  = find_last_conv_layer(mobilenet)

    image_bytes          = await file.read()
    img_batch, original  = preprocess_image(image_bytes)

    # Ensemble prediction
    pred_idx, confidence, top3 = run_ensemble(img_batch)

    # Grad-CAM
    heatmap, _, _  = make_gradcam_heatmap(img_batch, mobilenet, last_conv_layer)
    overlaid       = overlay_gradcam(original, heatmap)
    heatmap_b64    = image_to_base64(overlaid)

    return {
        "blood_group":   INDEX_TO_CLASS[pred_idx],
        "confidence":    round(confidence * 100, 2),
        "top3":          top3,
        "heatmap_image": heatmap_b64
    }