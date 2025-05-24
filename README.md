# 📘 API Flow - Desktop API Documentation Generator

**API Flow** is a modern, lightweight desktop application built using **Electron + React** that allows developers to create, organize, test, and document API requests with ease. Think of it as your offline Postman-inspired workspace, tailored for clean documentation and fast request testing.

---

## 🚀 Features (V1)

### 📂 Project & Collection Management
- Create a **Project** and structure it using **Collections** (like folders).
- Collections can be nested and contain:
  - Title
  - Description
  - Subfolders (Nested Collections)
  - Requests

### 🔧 Request Creation
Each request includes:
- **Title** & **Description**
- **URL**
- **Method** (GET, POST, etc.)
- **Headers**
- **Body** (supports JSON, FormData including file uploads)
- Save **Response**, including:
  - Status
  - Response Body
  - Time taken
  - Response size

### 🌐 Environment Variables
- Define and reuse variables like `{{base_url}}` or `{{auth_token}}`.

### 🧪 Request Metrics
- Track request **speed (ms)** and **size (bytes/kb)**
- Supports form data, JSON, and binary uploads (e.g., images)

### 📁 Data Storage (Local)
- All user data (collections, requests, env vars) is stored in **JSON files**
- Optionally persist config in Electron’s `userData` directory

---

## 💻 Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | React (CRA)              |
| Desktop     | Electron                 |
| Styling     | Tailwind CSS (optional)  |
| Storage     | JSON files (local)       |
| Packaging   | electron-builder         |

---

## 📁 Project Structure

