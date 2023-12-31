const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2pqppgl.mongodb.net/?retryWrites=true&w=majority`;

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
    const taskCollection = client.db("gamersGrid").collection("tasks");
    const gamerCollection = client.db("gamersGrid").collection("gamers");
    const guildCollection = client.db("gamersGrid").collection("guilds");

    // jwt related api
    app.post("/jwt", async (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1hr",
        });
        res.send({ token });
      });

    // task related api 
    app.get("/tasks", async(req, res) => {
        const result = await taskCollection.find().toArray();
        res.send(result);
      })
    
    app.post("/tasks", async (req, res) => {
        const item = req.body;
        const result = await taskCollection.insertOne(item);
        res.send(result);
      });

      app.delete('/tasks/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result); 
    })

    // gamers related api 
    app.get("/gamers", async(req, res) => {
        const result = await gamerCollection.find().toArray();
        res.send(result);
      })

      // guild related api
      app.get("/guilds", async(req, res) => {
        const result = await guildCollection.find().toArray();
        res.send(result);
      }) 
     
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged GamersGrid. GamersGrid is successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('GamersGrid is Running')
})
 
app.listen(port, () => {
    console.log(`GamersGrid is running on port ${port}`)
})