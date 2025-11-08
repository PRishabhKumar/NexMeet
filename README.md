# 🌐 NexMeet

### 🚀 A Modern MERN Stack Video Conferencing Platform with Real-Time Chat & Screen Sharing

[![Render Deployment](https://img.shields.io/badge/Deployed%20on-Render-blue?logo=render)](https://nexmeet-calling-platform-dmng.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/View%20on-GitHub-black?logo=github)](https://github.com/PRishabhKumar/NexMeet)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com/PRishabhKumar/NexMeet)


---

## 📖 Overview

**NexMeet** is a **real-time video calling platform** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It enables **secure video conferencing, live chat, screen sharing**, and **user authentication**, all packed in a clean, intuitive interface.

This project was created to provide a **modern, lightweight, and privacy-friendly** alternative to commercial meeting tools — with no unnecessary complexity.

---

## ✨ Features

- 🎥 **Video Calling** – Real-time video meetings using WebRTC and Socket.io  
- 💬 **Instant Messaging** – Real-time group chat in each meeting  
- 🖥️ **Screen Sharing** – Share your entire screen or application window  
- 🔐 **User Authentication** – Secure Login/Register using JWT  
- 🧠 **Meeting Management** – Create, join, and track meeting details  
- 💾 **Database Integration** – MongoDB stores user and meeting data  
- 🧭 **Responsive Design** – Works smoothly on all screen sizes  
- 🚀 **Deployed on Render** – Live and ready for use  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Real-Time Communication** | Socket.io, WebRTC |
| **Authentication** | JSON Web Tokens (JWT) |
| **Deployment** | Render |
| **Version Control** | Git & GitHub |

---

## 🏗️ Architecture Overview

Frontend (React) → Backend (Node + Express)

WebRTC + Socket.io for Real-time Communication

MongoDB Database (User + Meeting Data)


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PRishabhKumar/NexMeet.git
cd NexMeet
```
## Install Dependencies
# Backend
```bash
cd Backend
npm install
```
# Frontend
```bash
cd ../Frontend
npm install
```
# Set Up Environment Variables
In the Backend directory, create a .env file and add:
```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

## Run the Application
# Start Backend Server
```bash
cd Backend
npm start
```
# Start Frontend
```bash
cd ../Frontend
npm run dev
```

Now open the app in your browser at
👉 http://localhost:5173
