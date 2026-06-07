import numpy as np
import cv2
import tensorflow as tf
import base64
from PIL import Image
import io


def find_last_conv_layer(model) -> str:
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    raise ValueError("No Conv2D layer found in model")


def make_gradcam_heatmap(
    img_batch: np.ndarray,
    model,
    last_conv_layer_name: str
) -> tuple:
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[
            model.get_layer(last_conv_layer_name).output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_batch)
        if isinstance(predictions, list):
            predictions = predictions[0]
        predictions = tf.cast(predictions, tf.float32)
        pred_index  = int(np.argmax(predictions.numpy()[0]))
        class_score = predictions[0][pred_index]

    grads        = tape.gradient(class_score, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap      = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap      = tf.squeeze(heatmap)
    heatmap      = tf.nn.relu(heatmap)
    heatmap      = heatmap / (tf.math.reduce_max(heatmap) + 1e-8)

    return heatmap.numpy(), pred_index, predictions.numpy()


def overlay_gradcam(
    original_img: np.ndarray,
    heatmap: np.ndarray,
    alpha: float = 0.4
) -> np.ndarray:
    if original_img.max() <= 1.0:
        original_img = np.uint8(255 * original_img)
    if len(original_img.shape) == 2:
        original_img = cv2.cvtColor(original_img, cv2.COLOR_GRAY2RGB)
    elif original_img.shape[2] == 4:
        original_img = original_img[:, :, :3]

    h, w            = original_img.shape[:2]
    heatmap_resized = cv2.resize(heatmap, (w, h))
    heatmap_resized = cv2.GaussianBlur(heatmap_resized, (15, 15), 0)
    heatmap_colored = cv2.applyColorMap(
        np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET
    )
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    original_img    = original_img.astype(np.uint8)
    heatmap_colored = heatmap_colored.astype(np.uint8)

    return cv2.addWeighted(original_img, 1 - alpha, heatmap_colored, alpha, 0)


def image_to_base64(img_array: np.ndarray) -> str:
    """Convert numpy image array to base64 string for API response"""
    img     = Image.fromarray(img_array.astype(np.uint8))
    buffer  = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"