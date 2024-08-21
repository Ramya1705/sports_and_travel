import cors from 'cors';
import express from 'express';
import { connectToDB, db } from "./db.js";
import { MongoClient, ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
//  import {config} from 'dotenv';

const app = express();
const port=process.env.PORT||9000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json("Server is running successfully!");
});

app.post('/', (req, res) => {
    res.json("Server is running successfully!");
});

// Existing routes
app.post('/ast', async (req, res) => {
    try {
        const result = await db.collection("ast").find().toArray();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/insert', async (req, res) => {
    try {
        const result = await db.collection("ast").insertOne({ Name: req.body.name, Team: req.body.team });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to insert data' });
    }
});

app.post('/insertmany', async (req, res) => {
    try {
        const result = await db.collection("ast").insertMany(req.body);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to insert multiple data' });
    }
});

app.post('/findone', async (req, res) => {
    try {
        const result = await db.collection("ast").findOne({ Name: "teja" });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to find data' });
    }
});

app.post('/findmany', async (req, res) => {
    try {
        const result = await db.collection("ast").find().toArray();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to find many data' });
    }
});

app.post('/updateone', async (req, res) => {
    try {
        const result = await db.collection("ast").updateOne({ Name: "teja" }, { $set: { Age: 20 } });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update one data' });
    }
});

app.post('/updateone', async (req, res) => {
    try {
        const result = await db.collection("ast").findOneAndUpdate({ Name: "teja" }, { $set: { Age: 20 } });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to find and update one data' });
    }
});

app.post('/updatemany', async (req, res) => {
    try {
        const result = await db.collection("ast").updateMany({ Age: 20 }, { $set: { Age: 25 } });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update many data' });
    }
});

app.post('/deleteone', async (req, res) => {
    try {
        const result = await db.collection("ast").deleteOne({ Name: "teja" });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to delete one data' });
    }
});

app.post('/deletemany', async (req, res) => {
    try {
        const result = await db.collection("ast").deleteMany();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to delete many data' });
    }
});

// Authentication routes
app.post('/signin', async (req, res) => {
    console.log("Sign in triggered");
    try {
        const { email, password } = req.body;
        const userdata = await db.collection("users").findOne({ Email: email });
        if (!userdata) {
            return res.json({
                status: "fail",
                message: "User not found"
            });
        }
        if (password !== userdata.Password) {
            return res.json({
                status: "fail",
                message: "Password mismatch"
            });
        } else {
            res.json({
                status: "success",
                message: "Successfully logged in",
                data:userdata
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to sign in' });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const result = await db.collection("users").insertOne({ User: username, Password: password, Email: email });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to sign up' });
    }
});

// New route for feedback
app.post('/submit_feedback', async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;

        if (!name || !email || !rating || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const feedback = {
            name,
            email,
            rating,
            message,
            date: new Date(),
        };

        const result = await db.collection("feedbacks").insertOne(feedback);
        res.status(200).json({ message: 'Feedback submitted successfully!' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



// Routes
app.get('/api/blogs/:userId', async (req, res) => {
  try {
    console.log("inapicall /api/blogs/:userId")
    const userId = req.params.userId;
    const blogs = await db.collection('blogs').find({ userId }).toArray();
    console.log(blogs)
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

app.get('/api/blogs/:userId/:blogId', async (req, res) => {
  try {
    console.log("inapicall")
    const { userId, blogId } = req.params;
    const blog = await db.collection('blogs').findOne({
      _id: new ObjectId(blogId),
      userId,
    });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

app.post('/api/blogs', upload.single('media'), async (req, res) => {
  try {
    console.log("inapicall")
    const { userId, title, content, place, date } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename} `: null;
    console.log(req.body)
    const newBlog = {
      userId,
      title,
      content,
      place,
      date,
      mediaUrl,
      createdAt: new Date(),
    };
    const result = await db.collection('blogs').insertOne(newBlog);
    console.log(result,"result")
    res.status(201).json({ message: 'Blog created successfully', blogId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog' });
  }
});


connectToDB(() => {
    app.listen(9000, () => {
        console.log("Server running at http://localhost:9000");
    });
});
