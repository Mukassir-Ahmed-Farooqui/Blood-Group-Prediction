<div align="center">
  
# 🩸 Blood Group Detection System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

An explainable fingerprint-based blood group detection system using Ensemble Deep Learning and Grad-CAM.

---

</div>

## 🚀 Overview

This application leverages Deep Learning to predict a person's blood group from fingerprint images. To ensure high accuracy and reliability, it uses an **Ensemble Model** combining `MobileNetV2`, `ResNet50`, and `EfficientNet-B3`.

Crucially, it features **Explainability via Grad-CAM**, generating heatmaps that highlight which regions of the fingerprint the neural network focused on to make its prediction. This adds transparency and trustworthiness to the AI's decisions.

## ✨ Key Features

- **🧠 Ensemble Modeling:** Aggregates predictions from three state-of-the-art CNN architectures for enhanced accuracy (87.00% Test Accuracy).
- **🔍 Explainable AI (Grad-CAM):** Visualizes the model's decision-making process by generating diagnostic heatmaps over the original fingerprints.
- **⚡ High-Performance Backend:** Built with **FastAPI** for blazing fast, asynchronous API endpoints.
- **🎨 Modern React Frontend:** A responsive, interactive UI built with **Vite** and **React**, featuring drag-and-drop file uploads.

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | `FastAPI`, `Python` | Asynchronous RESTful API |
| **Machine Learning** | `TensorFlow`, `Keras`, `NumPy` | Image classification and Grad-CAM |
| **Frontend** | `React`, `Vite`, `Axios` | Fast, modern web interface |

## 🏗️ Project Structure

```bash
📦 Blood Group
 ┣ 📂 backend            # FastAPI Server & ML Models
 ┃ ┣ 📜 main.py          # API Endpoints (/predict, /gradcam, etc.)
 ┃ ┣ 📜 models.py        # Ensemble Model loading & configuration
 ┃ ┣ 📜 gradcam.py       # Grad-CAM Heatmap Generation Logic
 ┃ ┣ 📜 preprocessing.py # Image resizing and normalization
 ┃ ┗ 📜 requirements.txt # Python dependencies
 ┣ 📂 frontend           # React + Vite Application
 ┃ ┣ 📂 src              # React components and styles
 ┃ ┣ 📜 package.json     # Node dependencies
 ┃ ┗ 📜 vite.config.js   # Vite configuration
 ┗ 📜 README.md
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Mukassir-Ahmed-Farooqui/Blood-Group-Prediction.git
cd Blood-Group-Prediction
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`*

## 🔮 Endpoints

- `GET /` - API Status
- `GET /health` - Health check & model status
- `GET /models/info` - Model ensemble metadata
- `POST /predict` - Upload image, returns blood group & confidence
- `POST /gradcam` - Upload image, returns Grad-CAM heatmap
- `POST /predict-full` - Upload image, returns prediction + heatmap together

## 🛡️ License

This project is licensed under the MIT License.
