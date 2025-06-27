# PicSpace

PicSpace is a platform, allowing users to sign up, log in, upload photos, like uploaded photos, view other users' profiles, and edit their own profiles. It is built with Vite + React.js for the frontend, Node.js with Express.js for the backend, Multer & cloudinary for photo upload handling, and MongoDB for the database.

## Live Link
[Visit PicSpace](https://picspace-v546.onrender.com/)
**Note:** Site will take few seconds before loading as it is deployed on render for free

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites) 
4. [Setup Instructions](#setup-instructions)
5. [Usage](#usage)
7. [Contributing](#contributing)

## Features
1. **User Authentication:**
   - Users can sign up for an account.
   - Users can log in using their credentials.
   - JSON Web Tokens (JWT) are used for authentication and authorization.

2. **Profile Management:**
   - Users can edit their profile information such as fullname, bio, profile picture, etc.

3. **Photo Upload:**
   - Users can upload photos to their profiles.
   - Multer middleware is used for handling file uploads.
   - Cloudinary is used as a cloud storage for storing image files.

4. **Photo Interaction:**
   - Users can like photos uploaded by other users.
   - Users can view profiles of other users.
   
## Technologies Used
- **Frontend:** Vite (React.js)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Upload Handling:** Multer, Sharp, Cloudinary
- **Authentication:** JSON Web Tokens (JWT)

## Prerequisites
Before you begin, ensure you have  met the following requirements:
1. Node.js installed.
2. MongoDB installed and running.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/harshdev4/picSpace.git
   ```

2. Navigate to the project directory:
   ```bash
   cd backend
   ```

3. Install server dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   npx nodemon
   ```
   

7. Navigate to the client directory:
   ```bash
   cd frontend
   ```

8. Install client dependencies:
   ```bash
   npm install
   ```

9. Start the client:
   ```bash
   npm run dev
   ```

## Usage
- **Server will start at `http://localhost:3000`
- **Once the server and client are running, navigate to `http://localhost:${port_given_by_React}` in your web browser to access the application. From there, you can sign up, log in, upload photos, interact with photos, and manage your profile.

## Contributing
Contributions are welcome! Feel free to open issues or pull requests.
