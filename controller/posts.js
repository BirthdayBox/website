const fs = require('fs');
let posts = global.posts;

try {
  posts = require('../posts.json');
} catch (err) {
  posts = [];
  save();
}

function save() {
  return fs.writeFileSync('./posts.json', JSON.stringify(posts));
}

function genRandomId() {
  let id = require('crypto').randomBytes(12).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  if (posts.find((post) => {return post.id == id})) {
    return genRandomId();
  } else {
    return id;
  }
}

module.exports = {
  list: function() {
    return posts.sort((a, b) => {return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()})
  },
  add: function(post) {
    let newPost = {
      id: genRandomId(),
      timestamp: new Date(),
      pic: post.pic || null,
      title: post.title || 'No title?',
      body: post.body || null
    }
    posts.push(newPost);
    save();
  }
}
