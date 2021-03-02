const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { getLinkPreview } = require('link-preview-js');
const {
  smashing,
  hackernoon,
  hackernews,
  freecodecamp,
} = require('../config/config.js');

const getSmashing = async (n) => {
  let url = smashing.articleURL;

  if (n > 1) {
    url += `/page/${n}`;
  }

  let response = await fetch(url);
  let html = await response.text();

  const $ = cheerio.load(html);
  const articleSelector =
    '#main > section > .container > .row > .col-12 article';

  let articlePromiseArray = [];

  $(articleSelector).each(function (i) {
    let title = $('.article--post__title', this).text().replace(/\s+/g, ' ');

    let summary = $('.article--post__content > p', this)
      .text()
      .replace(/\s+/g, ' ')
      .replace(' Read more… ', '');

    let articleURL = smashing.baseURL + $('.read-more-link', this).attr('href');

    let myPromise = new Promise((resolve, reject) => {
      getLinkPreview(articleURL).then(function (linkPreview) {
        let imageURL = linkPreview.images[0];

        const articleObj = {
          title,
          summary,
          articleURL,
          imageURL,
        };

        resolve(articleObj);
      });
    });

    articlePromiseArray.push(myPromise);
  });

  return Promise.all(articlePromiseArray).then((articles) => {
    return articles;
  });
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
  let url = `${hackernews.articleURL}/${id}.json`;

  let response = await fetch(url).then((res) => res.json());

  // imageURL
  let imageURL = await getLinkPreview(response.url).then(
    (res) => res.images[0]
  );

  // structure output of hackernews articles
  return {
    title: response.title,
    articleURL: response.url,
    imageURL,
  };
};

const getLimited = async (n) => {
  // Refactor page/parameter logic
  let limit = n * 10;
  let start = limit - 10;

  let topStoriesIds = await getHackernews();
  let promiseArray = await topStoriesIds
    .slice(start, limit)
    .map((storyId) => getHackernewsById(storyId));

  let stories = await Promise.all(promiseArray);

  console.log('Stories length:', stories.length);
  return stories;
};

const getFCCArticles = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  const mainSelector = '#site-main';
  // const readMoreBtnSelector = '#readMoreBtn';

  await page.goto(freecodecamp.articleURL);

  await page.waitForSelector(mainSelector);
  // await page.waitForSelector(readMoreBtnSelector);

  // await page.click(readMoreBtnSelector);
  // await page.waitForSelector(
  //   '#site-main > div > div.post-feed article:nth-child(26)'
  // );

  let articles = await page.evaluate(async (mainSelector) => {
    const articlesSelector = '.post-feed > article';
    const mainElement = document.querySelector(mainSelector);

    const articleArray = Array.from(
      mainElement.querySelectorAll(articlesSelector)
    );

    return articleArray.map((article) => {
      let articleURL = article.querySelector('a').href;
      let imageURL = article.querySelector('img').src;

      let headerChildren = Array.from(
        article.querySelector('.post-card-content > div > header').children
      );
      let [tags, title] = headerChildren.map((child) => child.innerText);

      return {
        title,
        tags,
        imageURL,
        articleURL,
      };
    });
  }, mainSelector);

  await browser.close();
  return articles;
};

module.exports = {
  getSmashing,
  getHackernoon,
  getHackernews,
  getHackernewsById,
  getLimited,
  getFCCArticles,
};
