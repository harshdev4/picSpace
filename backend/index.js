const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const postRoute = require('./routes/post.route');
const path = require('path');

const app = express();
const PORT = process.env.PORT


app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }))
}

app.use('/api/user', userRoute);
app.use('/api/post', postRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at ${PORT}`);
    })
}).catch((err) => {
    console.log("DB Connection =>", err?.errorResponse?.errmsg || err.message || err);
});