module.exports = {
  DB: {
    uri: 'mongodb://localhost:27017/dev-news-test',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
  smashing: {
    baseURL: 'https://www.smashingmagazine.com',
    articleURL: 'https://www.smashingmagazine.com/articles/',
  },
  hackernoon: {
    baseURL: 'https://hackernoon.com/',
    articleURL: 'https://hackernoon.com/tagged/hackernoon-top-story',
  },
  hackernews: {
    baseURL: 'https://news.ycombinator.com/',
    bestArticlesURL: 'https://hacker-news.firebaseio.com/v0/beststories.json',
    articleURL: 'https://hacker-news.firebaseio.com/v0/item',
  },
  freecodecamp: {
    baseURL: 'https://www.freecodecamp.org',
    articleURL: 'https://www.freecodecamp.org/news',
  },
};
