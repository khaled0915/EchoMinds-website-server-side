const express  = require('express');

const jwt = require('jsonwebtoken');

const cors = require('cors') ;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware

app.use(cors());

app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwxnn.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();



    // blog collection 

    const blogsCollection = client.db('blogCollection').collection('blog');


    const userCollection = client.db('blogCollection').collection('users');



    // jwt related

    app.post('/jwt' , async(req,res)=>{
      const user = req.body ;

      const token = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {
        expiresIn : '2h',
      })
      res.send({token});
    })



    app.get('/blogs', async(req,res)=>{
      const result = await blogsCollection.find().toArray()

      res.send(result);
    })

    app.get('/blogs/:id' , async(req,res)=>{

      const id = req.params.id;

      const query = { _id : new ObjectId(id) };

      const result = await blogsCollection.findOne(query);
      res.send(result)
    })

    app.get('/users' , async(req,res)=>{
      const result  = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/users' , async(req,res)=>{
      const user = req.body ;

      const query = { email : user.email };

      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({ message : 'user already exists' , insertedId : null })
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.post('/blogs' , async(req, res)=>{
      const item = req.body ;

      const result  = await blogsCollection.insertOne(item);
      res.send(result);
    })











    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.get('/' , (req,res)=>{

    res.send('server is  running')
})

app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
})
