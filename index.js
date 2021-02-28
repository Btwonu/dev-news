const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const {
  getSmashing,
  getHackernoon,
  getHackernews,
  getHackernewsById,
  getLimited,
} = require('./services/articleService');

app.get('/', (req, res) => {
  res.end('hello, val');
});

app.get('/smashing/:pageId?', (req, res) => {
  const pageId = req.params.pageId;

  getSmashing(pageId)
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/hackernoon', (req, res) => {
  getHackernoon()
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/hackernews/:pageId?', (req, res) => {
  const pageId = req.params.pageId;

  getLimited(pageId)
    .then((stories) => res.json(stories))
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
