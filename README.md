<div align="center">

# 🩸 AI-Based Blood Group Prediction from Fingerprints

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge\&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge\&logo=vite\&logoColor=FFD62E)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge\&logo=pytorch\&logoColor=white)](https://pytorch.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)

An AI-powered fingerprint-based blood group prediction system using Ensemble Deep Learning and Test-Time Augmentation (TTA), achieving **92% classification accuracy** on the Rajumanvir Blood Group Fingerprint Dataset.

---

</div>

## 🚀 Overview

This project presents an AI-based blood group prediction system that classifies blood groups from fingerprint images using Deep Learning techniques. The system is trained on the **Rajumanvir Blood Group Fingerprint Dataset** from Kaggle and leverages an ensemble of multiple state-of-the-art Convolutional Neural Networks to improve classification performance.

The solution combines **ConvNeXt-Tiny**, **EfficientNet-B0**, and **ResNet34** through a weighted soft-voting ensemble mechanism. Additionally, **Test-Time Augmentation (TTA)** is applied during inference to enhance robustness and generalization.

The final ensemble model achieves **92% accuracy** and is integrated into a full-stack web application using **FastAPI** and **React**, enabling real-time blood group prediction from uploaded fingerprint images.

---

## ✨ Key Features

* 🧠 Ensemble Deep Learning using ConvNeXt-Tiny, EfficientNet-B0, and ResNet34.
* 🎯 Weighted Soft Voting for improved prediction reliability.
* 🔄 Test-Time Augmentation (TTA) for robust inference.
* 📊 Confusion Matrix and Class-wise Accuracy Evaluation.
* ⚡ High-Performance Backend built with FastAPI.
* 🎨 Modern React Frontend with drag-and-drop image upload.
* 🚀 Real-Time Blood Group Prediction from fingerprint images.
* 📈 Achieved **92% Test Accuracy** on the Rajumanvir dataset.

---

## 🛠️ Technology Stack

| Component       | Technology                 | Description                     |
| --------------- | -------------------------- | ------------------------------- |
| Backend         | FastAPI, Python            | REST API Services               |
| Deep Learning   | PyTorch, TIMM, Torchvision | Model Training & Inference      |
| Data Processing | NumPy, PIL, Scikit-Learn   | Dataset Processing & Evaluation |
| Visualization   | Matplotlib, Seaborn        | Performance Analysis            |
| Frontend        | React, Vite, Axios         | User Interface                  |

---

## 🏗️ Model Architecture

### Individual Models

The ensemble consists of three independently trained CNN architectures:

### 1. ConvNeXt-Tiny

* Modern CNN architecture inspired by Vision Transformers.
* Strong hierarchical feature extraction.
* Excellent representation learning for image classification.

### 2. EfficientNet-B0

* Uses compound scaling to balance depth, width, and resolution.
* Lightweight and computationally efficient.
* Provides strong performance with fewer parameters.

### 3. ResNet34

* Employs residual connections to address vanishing gradients.
* Enables deeper network training.
* Strong baseline architecture for image recognition tasks.

---

## 🧠 Ensemble Strategy

Predictions from all three models are combined using **Weighted Soft Voting**:

```text
Final Prediction =
0.40 × ConvNeXt-Tiny +
0.35 × EfficientNet-B0 +
0.25 × ResNet34
```

The class with the highest combined probability is selected as the final blood group prediction.

This ensemble approach improves:

* Generalization
* Stability
* Prediction confidence
* Classification accuracy

---

## 🔄 Test-Time Augmentation (TTA)

To improve robustness during inference, Test-Time Augmentation is applied.

Transformations include:

* Random Rotation
* Horizontal Flip

Multiple augmented versions of the same fingerprint image are passed through the models, and the resulting probabilities are averaged to generate the final prediction.

Benefits:

* Reduced prediction variance
* Improved performance on unseen samples
* Better robustness against image orientation variations

---

## 📂 Dataset

### Dataset Information

**Dataset Name:** Rajumanvir Blood Group Detection Dataset

**Source:** Kaggle

The dataset consists of fingerprint images categorized into eight blood-group classes:

```text
A+
A-
B+
B-
AB+
AB-
O+
O-
```

### Dataset Structure

```bash
dataset_blood_group/
│
├── A+
├── A-
├── B+
├── B-
├── AB+
├── AB-
├── O+
└── O-
```

### Data Preprocessing

The following preprocessing steps were applied:

* Grayscale conversion to 3-channel format
* Image resizing to 224 × 224 pixels
* Normalization using ImageNet mean and standard deviation
* Random horizontal flipping
* Random rotations
* Stratified train-validation-test splitting

### Dataset Split

| Split      | Percentage |
| ---------- | ---------- |
| Training   | 75%        |
| Validation | 15%        |
| Testing    | 10%        |

---

## ⚙️ Training Configuration

| Parameter                | Value             |
| ------------------------ | ----------------- |
| Framework                | PyTorch           |
| Image Size               | 224 × 224         |
| Batch Size               | 32                |
| Optimizer                | AdamW             |
| Learning Rate            | 3e-4              |
| Loss Function            | CrossEntropyLoss  |
| Epochs                   | 10                |
| Early Stopping           | Patience = 3      |
| Mixed Precision Training | Enabled           |
| Device                   | NVIDIA GPU / CUDA |

---

## 📊 Evaluation Metrics

The system is evaluated using:

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix
* Classification Report
* Class-wise Accuracy

Generated outputs include:

```bash
results_fast/
│
├── models/
│   ├── convnext.pth
│   ├── efficientnet.pth
│   └── resnet.pth
│
└── plots/
    ├── confusion_matrix.png
    ├── ensemble_confusion_matrix.png
    ├── class_accuracy.png
    ├── prediction_distribution.png
    └── classification_report.txt
```

---

## 🎯 Results

### Final Performance

| Metric                | Value                                      |
| --------------------- | ------------------------------------------ |
| Test Accuracy         | **92.0%**                                  |
| Architecture          | ConvNeXt-Tiny + EfficientNet-B0 + ResNet34 |
| Ensemble Method       | Weighted Soft Voting                       |
| Inference Enhancement | Test-Time Augmentation (TTA)               |
| Framework             | PyTorch                                    |

### Key Findings

* Ensemble learning significantly improved performance over individual models.
* ConvNeXt-Tiny contributed the strongest feature extraction capability.
* Test-Time Augmentation improved prediction stability.
* Weighted soft voting reduced misclassification among visually similar fingerprint patterns.
* The final ensemble achieved **92% accuracy** on the test dataset.

---

## 🏗️ Project Structure

```bash
📦 Blood Group Prediction
 ┣ 📂 backend
 ┃ ┣ 📜 main.py
 ┃ ┣ 📜 models.py
 ┃ ┣ 📜 preprocessing.py
 ┃ ┗ 📜 requirements.txt
 ┃
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 vite.config.js
 ┃
 ┣ 📂 trained_models
 ┃ ┣ 📜 convnext.pth
 ┃ ┣ 📜 efficientnet.pth
 ┃ ┗ 📜 resnet.pth
 ┃
 ┣ 📂 plots
 ┃ ┣ 📜 confusion_matrix.png
 ┃ ┣ 📜 class_accuracy.png
 ┃ ┗ 📜 classification_report.txt
 ┃
 ┗ 📜 README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blood-group-prediction.git
cd blood-group-prediction
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend will run at:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 🔮 API Endpoints

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | /            | API Status          |
| GET    | /health      | Health Check        |
| GET    | /models/info | Model Information   |
| POST   | /predict     | Predict Blood Group |

### Example Response

```json
{
  "predicted_blood_group": "A+",
  "confidence": 0.92
}
```

---

## 📚 Dataset Reference

**Rajumanvir Blood Group Detection Dataset**

Kaggle Dataset:
https://www.kaggle.com/datasets/rajumanvir/blood-group-detection-dataset

---

## 👨‍💻 Author

**Nagarapu Sai Charan**
B.E. Artificial Intelligence & Machine Learning
Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad

### Technical Skills

* Python
* PyTorch
* TensorFlow
* Machine Learning
* Deep Learning
* Computer Vision
* FastAPI
* React
* MongoDB
* SQL
* Data Analysis

---

## 🔮 Future Improvements

* Integration of Vision Transformers (ViTs).
* Model quantization for edge deployment.
* Mobile application support.
* Larger multi-source fingerprint datasets.
* Advanced explainability techniques such as Grad-CAM and SHAP.
* Real-time deployment on cloud platforms.

---

## 🛡️ License

This project is licensed under the MIT License.
