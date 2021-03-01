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
  imageURL: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

articleSchema
  .path('articleURL')
  .validate(
    (value) => /^https?/.test(value),
    'Article url must be a valid HTTP/S link'
  );

articleSchema
  .path('imageURL')
  .validate(
    (value) => /^https?/.test(value),
    'Image url must be a valid HTTP/S link'
  );

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
