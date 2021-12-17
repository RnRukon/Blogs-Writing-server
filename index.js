const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware-------------
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.af4at.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// ------------------------------------------------------

async function run() {
    try {
        await client.connect();
        const database = client.db("Blogs-Writer");
        const blogsCollection = database.collection('products');
        // add Blogs==================================================
        app.post('/postABlogs', async (req, res) => {
            const blogs = req.body;
            const result = await blogsCollection.insertOne(blogs)
            res.json(result)
        })
        // all Blogs get ==============================================
        app.get('/Blogs', async (req, res) => {
            const Blogs = await blogsCollection.find({}).toArray();
            res.send(Blogs);
        })
        //get Details Blog--------------------
        app.get('/blogDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const blog = await blogsCollection.findOne(query)
            res.send(blog)
        })

        app.put('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const comment = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = { $push: { comments: comment } };
            const result = await blogsCollection.updateOne(query, updateDoc, options);
            res.json(result)
        })
        app.put('/like/:id', async (req, res) => {
            const id = req.params.id;
            const like = req.body;
            const query = { _id: ObjectId(id) }
            console.log(like)
            const options = { upsert: true };
            const updateDoc = { $push: { likes: like } };
            const result = await blogsCollection.updateOne(query, updateDoc, options);
            res.json(result)
        })




    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);
// ------------------------------------------------------


app.get('/', (req, res) => {
    res.send('Running Blogs-Writer');
})
app.get('/hello', (req, res) => {
    res.send("hello updated api testing")
})
app.listen(port, () => {
    console.log('Running Blogs-Writer', port)
})