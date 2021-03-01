const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { smashing, hackernoon, hackernews } = require('../config/config.js');

const getSmashing = async (n) => {
  let url = smashing.articleURL;

  if (n > 1) {
    url += `/page/${n}`;
  }

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const articles = [];

  $('#main > section > .container > .row > .col-12 article').each(function (i) {
    const articleObj = {
      title: $('.article--post__title', this).text().replace(/\s+/g, ' '),
      summary: $('.article--post__content > p', this)
        .text()
        .replace(/\s+/g, ' ')
        .replace(' Read more… ', ''),
      articleURL: smashing.baseURL + $('.read-more-link', this).attr('href'),
    };

    articles.push(articleObj);
  });

  return articles;
};

const getHackernoon = async () => {
  return hackernoon;
};

const getHackernews = async () => {
  const topStoriesIds = await fetch(hackernews.bestArticlesURL)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return topStoriesIds;
};

const getHackernewsById = async (id) => {
  const url = `${hackernews.articleURL}/${id}.json`;

  return fetch(url)
    .then((singleArticle) => {
      return {
        title: singleArticle.title,
        articleURL: singleArticle.url,
      };
    })
    .catch((err) => console.log(err));
};

const getLimited = async (n) => {
  const limit = n * 10;
  const start = limit - 10;

  const topStoriesIds = await getHackernews();
  const promiseArray = await topStoriesIds
    .slice(start, limit)
    .map((storyId) => getHackernewsById(storyId));

  const stories = await Promise.all(promiseArray);

  console.log('Stories length:', stories.length);
  return stories;
};

module.exports = {
  getSmashing,
  getHackernoon,
  getHackernews,
  getHackernewsById,
  getLimited,
};
