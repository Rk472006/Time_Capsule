# ⏳ Time Capsule

**A full-stack MERN application** that lets users send messages to their future selves or others. Capsules unlock at a scheduled time, enabling delayed communication, reflections, or surprises — like a digital time capsule.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Express](https://img.shields.io/badge/Backend-Express-black)
![Node.js](https://img.shields.io/badge/Server-Node.js-lightgrey)

---

## ✨ Features

- ✅ **User Authentication** via Firebase
- ✅ **Send & Schedule Capsules** to unlock in the future
- ✅ **Bin Feature**: Soft-delete, restore, or permanently delete capsules
- ✅ **Image Uploads & Previews** in capsules
- ✅ **Capsule Reactions** (❤️, 😮, etc.)

---

## 🚀 Tech Stack

| Tech          | Description                                 |
|---------------|---------------------------------------------|
| **Frontend**  | React, CSS, React Router, Axios             |
| **Backend**   | Node.js, Express.js                         |
| **Database**  | MongoDB                                     |
| **Auth**      | Firebase Authentication                     |
| **Storage**   | Multer (for file uploads)                   |

---

## 📂 Folder Structure

```bash
Time_Capsule/
├── client/                   # React frontend
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route pages (Inbox, Bin, Login, etc.)
│   └── utils/                # Firebase config 
│
├── server/                   # Node.js + Express backend
│   ├── middleware/           # Image upload middle ware
│   ├── models/               # Mongoose schemas (User, Capsule)
│   └── routes/               # REST API endpoints (Capsule, Auth, Image)
│
└── README.md                 # Project documentation
