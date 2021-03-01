const mongoose = require('mongoose');
const Article = require('../models/Article');

const addArticles = async (articleArray) => {
  const articles = await Article.insertMany(articleArray, { ordered: false });

  console.log('from mongoose:', articles);
  return articles;
};

const getArticles = async () => {
  return await Article.find({}).lean();
};

module.exports = {
  addArticles,
  getArticles,
};
