import os
import numpy as np
import tensorflow as tf
from huggingface_hub import hf_hub_download

REPO_ID    = "Mukassir305/blood-group-detection"
MODELS_DIR = "./models"

# Ensemble weights from Phase 5
ENSEMBLE_WEIGHTS = (0.4, 0.4, 0.2)  # MobileNet, ResNet, EfficientNet

# Class labels
INDEX_TO_CLASS = {
    0: "A+", 1: "A-", 2: "AB+", 3: "AB-",
    4: "B+", 5: "B-", 6: "O+", 7: "O-"
}

mobilenet_model    = None
resnet_model       = None
efficientnet_model = None


def download_models():
    os.makedirs(MODELS_DIR, exist_ok=True)
    files = [
        "mobilenetv2_best.keras",
        "resnet50_best.keras",
        "efficientnet_best.keras"
    ]
    for filename in files:
        path = os.path.join(MODELS_DIR, filename)
        if not os.path.exists(path):
            print(f"  Downloading {filename}...")
            hf_hub_download(
                repo_id=REPO_ID,
                filename=filename,
                local_dir=MODELS_DIR
            )
            print(f"  [OK] {filename} downloaded")
        else:
            print(f"  [cached] {filename} already cached")


def load_models():
    global mobilenet_model, resnet_model, efficientnet_model

    download_models()

    print("Loading models into memory...")
    mobilenet_model    = tf.keras.models.load_model(
        os.path.join(MODELS_DIR, "mobilenetv2_best.keras")
    )
    resnet_model       = tf.keras.models.load_model(
        os.path.join(MODELS_DIR, "resnet50_best.keras")
    )
    efficientnet_model = tf.keras.models.load_model(
        os.path.join(MODELS_DIR, "efficientnet_best.keras")
    )
    print("[OK] All 3 models loaded")


def get_models():
    return mobilenet_model, resnet_model, efficientnet_model