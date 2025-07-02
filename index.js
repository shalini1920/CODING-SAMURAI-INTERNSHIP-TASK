
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = 5000;

const serviceAccount = require('./serviceAccountkey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());


app.post('/api/blogs', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.collection('blogs').add({ title, content, createdAt: new Date() });
    res.status(200).send('Blog added successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});



app.get('/api/blogs', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get();
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('blogs').doc(id).delete();
    res.status(200).send('Blog deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});
app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await db.collection('blogs').doc(id).update({ title, content });
    res.status(200).send('Blog updated');
  } catch (err) {
    res.status(500).send(err);
  }
});