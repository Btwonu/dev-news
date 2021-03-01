const mongoose = require('mongoose');
const Article = require('../models/Article');

const addArticles = async (articleArray) => {
  const articles = await Article.insertMany(articleArray, { ordered: false });

  console.log('from mongoose:', articles);
};

module.exports = {
  addArticles,
};
