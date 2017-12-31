const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {posts: require('../controller/posts.js').list()})
})

module.exports =  router;
