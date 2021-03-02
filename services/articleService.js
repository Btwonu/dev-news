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

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const articleSelector =
    '#main > section > .container > .row > .col-12 article';

  let promises = [];

  $(articleSelector).each(function (i) {
    let title = $('.article--post__title', this).text().replace(/\s+/g, ' ');

    let summary = $('.article--post__content > p', this)
      .text()
      .replace(/\s+/g, ' ')
      .replace(' Read more… ', '');

    let articleURL = smashing.baseURL + $('.read-more-link', this).attr('href');

    let myPromise = new Promise((resolve, reject) => {
      getLinkPreview(articleURL).then(function (linkPreview) {
        const imageURL = linkPreview.images[0];

        const articleObj = {
          title,
          summary,
          articleURL,
          imageURL,
        };

        resolve(articleObj);
      });
    });

    promises.push(myPromise);
  });

  return Promise.all(promises).then((articles) => {
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
  const url = `${hackernews.articleURL}/${id}.json`;

  const response = await fetch(url).then((res) => res.json());

  return {
    title: response.title,
    articleURL: response.url,
  };
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

const getFCCArticles = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  await page.goto(freecodecamp.articleURL);

  const mainSelector = '#site-main';
  const readMoreBtnSelector = '#readMoreBtn';

  await page.waitForSelector(mainSelector);
  await page.waitForSelector(readMoreBtnSelector);

  // const readMoreBtn = document.getElementById(readMoreBtnSelector);
  await page.click(readMoreBtnSelector);
  await page.waitForSelector(
    '#site-main > div > div.post-feed article:nth-child(26)'
  );

  const articles = await page.evaluate(async (mainSelector) => {
    console.log(`url is ${location.href}`);

    const mainElement = document.querySelector(mainSelector);
    let articleArray = Array.from(
      mainElement.querySelectorAll('.post-feed > article')
    );

    return articleArray.map((article) => {
      const articleURL = article.querySelector('a').href;
      const imageURL = article.querySelector('img').src;

      const headerChildren = Array.from(
        article.querySelector('.post-card-content > div > header').children
      );
      const [tags, title] = headerChildren.map((child) => child.innerText);

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
