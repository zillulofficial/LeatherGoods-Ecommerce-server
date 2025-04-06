const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.port || 5000
const app = express()

// middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionsSuccessStatus: 200
  }))
  app.use(express.json())
  app.use(cookieParser())

// Custom middlewares
const cookieOption = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
    secure: process.env.NODE_ENV === "production" ? true : false
  }
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token
    // console.log("token in the middleware: ", token);
    if (!token) {
      return res.status(401).send({ message: "Unauthorized access" })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized access" })
      }
      req.user = decoded
      next()
    })
  }
  
  


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

    const userCollection = client.db('tanexInternational').collection('user')
    const menuCollection = client.db('tanexInternational').collection('menu')
    const orderCollection = client.db('tanexInternational').collection('order')
    
    // middleware
    // use verify admin after verifying token
    const verifyAdmin = async (req, res, next) => {
      const email = req.user?.email
      const query = { email: email }
      const user = await userCollection.findOne(query)
      const isAdmin = user?.role === "admin"
      if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden  access" })
      }
      next()
    }

    // JWT related API
    app.post('/jwt', async (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d'
      })
      res
        .cookie('token', token, cookieOption)
        .send({ success: true })
    })
    // token removal after user logs out
    app.post('/logout', async (req, res) => {
      const user = req.body
      res.clearCookie('token', { ...cookieOption, maxAge: 0 }).send({ success: true })
    })

    // user related API
    app.post('/users', async(req, res)=>{
      const user= req.body
      // insert email if it doesn't exist
      // it can be done in various ways (email unique, upsert, simple checking)
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      console.log(result);
      res.send(result)
    })

    app.get('/users', async(req, res)=>{
      const result= await userCollection.find().toArray()
      res.send(result)
    })

    app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })
    app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: "admin"
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

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