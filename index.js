const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.port || 9000
const app = express()

// middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionsSuccessStatus: 200
  }))
  app.use(express.json())
//   app.use(cookieParser())

// Custom middlewares
// const cookieOption = {
//     httpOnly: true,
//     sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
//     secure: process.env.NODE_ENV === "production" ? true : false
//   }
// const verifyToken = (req, res, next) => {
//     const token = req?.cookies?.token
//     // console.log("token in the middleware: ", token);
//     if (!token) {
//       return res.status(401).send({ message: "Unauthorized access" })
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({ message: "Unauthorized access" })
//       }
//       req.user = decoded
//       next()
//     })
//   }
  
  

app.get('/', (req, res) => {
    res.send('Tanex International Server running smoothly!')
  })
  app.listen(port, () => console.log(`Server Running at port: ${port}`))