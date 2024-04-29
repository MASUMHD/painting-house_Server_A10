const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zi8pxok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    await client.connect();

    const addItemCollection = client.db('paintingHouseDB').collection('items');

    app.get('/addItems', async (req, res) => {
        const cursor = addItemCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/addItems/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:  new ObjectId(id) };
        const result = await addItemCollection.findOne(query);
        res.send(result);
    })

    // app.put('/addItems/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = {_id: new ObjectId(id)};
    //     const result = await addItemCollection.findOne(query);
    //     res.send(result);
    // })



    app.put('/addItems/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = req.body;
        const update = {
            $set: {
                item_name: updateDoc.item_name,
        subcategory_name: updateDoc.subcategory_name,
      short_description: updateDoc.short_description,
      customization: updateDoc.customization,
      stockStatus: updateDoc.stockStatus,
      imageURL: updateDoc.imageURL,
      price: updateDoc.price,
      rating: updateDoc.rating,
      processing_time: updateDoc.processing_time,
            },
        };
        const result = await addItemCollection.updateOne(filter, update, options);
        res.send(result);
        console.log(result);
    })

    app.delete('/addItems/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addItemCollection.deleteOne(query);
        res.send(result);
    })

    app.get('/myArts/:email', async (req, res) => {
        const query = { user_email: req.params.email };
        const cursor = addItemCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/my/:category', async (req, res) => {
        const query = { subcategory_name: req.params.category };
        const cursor = addItemCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    // app.get('/singleArts/:id', async (req, res) => {

    // })

    app.post('/addItem', async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
        const result = await addItemCollection.insertOne(newItem);
        res.send(result);

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Painting house server is running....');
})

app.listen(port, () => {
    console.log(`Painting house server is running on port: ${port}`);
})