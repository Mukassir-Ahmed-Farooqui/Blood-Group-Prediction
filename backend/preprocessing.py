import numpy as np
import cv2
from PIL import Image
import io


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Full preprocessing pipeline — same as training:
    1. Read image from bytes
    2. Remove white border
    3. Resize to 224x224
    4. Grayscale → RGB via histogram equalization
    5. Normalize to [0, 1]
    6. Add batch dimension
    """
    # Read image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_array = np.array(img)

    # Remove white border
    img_array = remove_white_border(img_array)

    # Resize
    img_array = cv2.resize(img_array, (224, 224))

    # Grayscale → histogram equalization → RGB
    gray      = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    equalized = cv2.equalizeHist(gray)
    rgb       = cv2.merge([equalized, equalized, equalized])

    # Normalize
    rgb = rgb.astype(np.float32) / 255.0

    # Add batch dimension
    return np.expand_dims(rgb, axis=0), img_array


def remove_white_border(img_array: np.ndarray) -> np.ndarray:
    """Crop white background, keep only fingerprint region"""
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array

    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    if contours:
        largest  = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest)
        pad = 10
        x   = max(0, x - pad)
        y   = max(0, y - pad)
        w   = min(img_array.shape[1] - x, w + 2 * pad)
        h   = min(img_array.shape[0] - y, h + 2 * pad)
        return img_array[y:y+h, x:x+w]

    return img_array