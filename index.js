const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

require('./config/express')(app);
require('./config/db');

// const {
//   getSmashing,
//   getHackernoon,
//   getHackernews,
//   getHackernewsById,
//   getLimited,
//   getFCCArticles,
// } = require('./services/articleService');

const articleService = require('./services/articleService');
const { addArticles, getArticles } = require('./services/mongoService');

// Hello
app.get('/', (req, res) => {
  res.end('hello, val');
});

// Fetch and save to DB
app.get('/seed', (req, res) => {
  const { getSmashing, getLimited, getFCCArticles } = articleService;

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

// GET Articles from DB
app.get('/articles', (req, res) => {
  getArticles()
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => console.error(err));
});

// Smashing
app.get('/smashing/:pageId?', (req, res) => {
  const pageId = req.params.pageId;

  articleService
    .getSmashing(pageId)
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Hackernews
app.get('/hackernews/:pageId?', (req, res) => {
  const pageId = req.params.pageId;

  articleService
    .getLimited(pageId)
    .then((stories) => res.json(stories))
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

// FreeCodeCamp
