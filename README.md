# 🎬 YouTube Clone (MERN Stack)

A full-featured YouTube Clone built using the MERN stack (MongoDB, Express.js, React, Node.js), designed with a modern UI and responsive layout. It allows users to upload, view, like, and manage videos using YouTube URLs.
---

## 🌐 Live Demo

🔗 [Live Link](https://ytcloneabd.vercel.app/)

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 🎥 Add / Delete Videos (via YouTube URL)
- 📺 Watch Videos using React Player
- 🧑 Channel Page with Video Management
- 🔍 Search Functionality
- 🌙 Dark & Light Mode Toggle
- ⚡ Responsive Design
- 📡 Backend with REST API (Node.js + Express)
- 🗄️ MongoDB for storing user and video data

---

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS
- React Router DOM
- React Player

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- Multer / Google Drive API (optional for uploads)

**Deployment:**
- Vercel / Netlify (Frontend)
- Render / Railway / Heroku (Backend)
- GitHub (Code Hosting)

---

## 📁 Folder Structure

```bash
youtube-clone/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── App.jsx
├── server/               # Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .env
├── README.md
└── package.json
```
```
⚙️ Environment Variables
Create a .env file in both client/ and server/ folders and add:

Frontend:
VITE_API_BASE_URL=http://localhost:5000/api
PORT=5000

Backend:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

```🧑‍💻 Installation
1. Clone the repository:
git clone https://github.com/AbdulAhadSiddiqui-0786/Youtube-clone
cd youtube-clone

2.Setup Backend:
cd server
npm install
npm run dev

3. Setup Frontend:
cd client
npm install
npm run dev
```
```🔧 API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Register user
POST	/api/auth/login	Login user
GET	/api/videos	Fetch all videos
POST	/api/videos	Add new video
DELETE	/api/videos/:id	Delete video by ID
```
```🙋‍♂️ Author
Abdul Ahad Siddiqui
📧 Email: abdulahadsiddiqui23@gmail.com
🐙 GitHub: [https://github.com/AbdulAhadSiddiqui-0786]
```
```
⭐ Credits
React Player
Tailwind CSS
MongoDB Atlas
```


