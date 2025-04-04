const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  
  


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbx7ywt.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db('Tanex_International').collection('user')
    const menuCollection = client.db('Tanex_International').collection('menu')
    const orderCollection = client.db('Tanex_International').collection('order')
    

    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tanex International Server running smoothly!')
  })
  app.listen(port, () => console.log(`Server Running at port: ${port}`))