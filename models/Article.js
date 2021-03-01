const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  articleURL: {
    type: String,
    required: true,
    unique: true,
  },
});

articleSchema
  .path('articleURL')
  .validate(
    (value) => /^https?/.test(value),
    'Article url must be a valid HTTP/S link'
  );

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
