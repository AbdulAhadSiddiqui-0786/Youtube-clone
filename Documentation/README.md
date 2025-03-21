# YouTube Clone

## Project Overview
This is a YouTube Clone built using the MERN stack. Users can sign up, sign in,like videos, cooment on videos create a channel,Delete channel and upload videos with relevant details. only logged in user can comment ,editcomment,deletecomment and like on video .The project uses MongoDB Atlas as the database and supports video uploads via external URLs.
You can get video url,channel url, channel banner,logo,thumbnail from youtube . 

## Features
- **User Authentication**: Sign up and sign in functionality.
- **Channel Creation**: Users can create a channel with a name, description, URL, logo, and banner.
- **Video Management**:
  - Upload videos via URL along with a thumbnail, name, category, and description.
- **MongoDB Atlas**: Online database setup.
## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB Atlas (Already configured `.env` file)
- npm (Node Package Manager)

### Steps to Run the Application

#### 1. Clone the Repository
```sh
git clone https://github.com/your-repository/youtube-clone.git
cd youtube-clone
```

#### 2. Install Dependencies

**For Client (Frontend):**
```sh
cd client
npm install --force
```

**For Server (Backend):**
```sh
cd server
npm install --force
```

#### 3. Set Up Environment Variables
The `.env` file is already configured with MongoDB Atlas. Ensure you have your connection string set correctly.

#### 4. Run the Application

**For Client:**
```sh
npm run dev
```

**For Server:**
```sh
npm run dev
```

## Usage Guide

1. **Sign Up:** Create an account on the platform.
2. **Sign In:** Log in with your credentials.
3. **Create a Channel:** Provide details like:
   - Channel Name
   - Channel Description
   - Channel URL
   - Channel Logo
   - Channel Banner
4. **Manage Videos:**
   - **Upload Videos:** Provide details such as:
     - Video URL
     - Thumbnail URL
     - Video Name
     - Video Category
     - Video Description
5. **Delete Channel:**
    - Delete your channel by clicking on Delete button

## Contact Information
- **Developer:** Abdul Ahad Siddiqui
- **Phone:** 8574104430
- **Email:** Abdulahadsiddiqui23@gmail.com

## License
This project is open-source and free to use.

