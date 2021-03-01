const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

require('./config/express')(app);
require('./config/db');

const {
  getSmashing,
  getHackernoon,
  getHackernews,
  getHackernewsById,
  getLimited,
  getFCCArticles,
} = require('./services/articleService');
const { addArticles, getArticles } = require('./services/mongoService');

app.get('/', (req, res) => {
  res.end('hello, val');
});

app.get('/seed', (req, res) => {
  Promise.all([getSmashing(), getLimited(2), getFCCArticles()])
    .then((articleMatrix) => {
      console.log('All resolved!');

      articleMatrix.forEach((articleArr, i) => {
        addArticles(articleArr)
          .then((data) => {
            console.log(`Array ${i} saved!`);
            console.log({ data });
            res.end('seeded');
          })
          .catch((err) => console.error(err));
      });
    })
    .catch((err) => console.error(err));
});

app.get('/articles', (req, res) => {
  getArticles()
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => console.error(err));
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

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
