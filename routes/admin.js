/*TODO: UNFINNISHED*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs')
const SuAuth = require('passport-su');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `${require('crypto').randomBytes(12).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')}.${file.originalname.split('.').slice(-1)[0]}`);
  }
});
const upload = multer({storage: storage})

module.exports = (passport) => {

  passport.use(SuAuth.Strategy)

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  router.use(passport.initialize());
  router.use(passport.session());

  router.get('/', checkAuth, (req, res, next) => {
    res.render('adminpage')
  })

  router.get('/login', (req, res, next) => {
    if (process.env.devmode == "true" ? false : !req.user) {
      res.render('login');
    } else {
      res.redirect('/admin')
    }
  })

  router.post('/login', passport.authenticate('local', { failureRedirect: '/a' }), (req, res) => {
    res.redirect('/admin');
  });

  router.get('/newpost', checkAuth, (req, res) => {
    res.render('newpost')
  })

  router.post('/newpost', checkAuth, upload.single('pic'), (req, res) => {
    if (req.file && !['jpg', 'jpeg', 'png', 'bmp'].includes(req.file.filename.split('.').slice(-1)[0])) {
      fs.unlinkSync('./uploads/' + req.file.filename)
      res.status(400).send('Give me an image file!');
    } else {
      let post = {}
      Object.assign(post, req.body)
      if(req.file) {
        post.pic = '/uploads/' + req.file.filename
      }
      require('../controller/posts.js').add(post)
      res.redirect('/');
    }
  });

  router.get('/manage', checkAuth, (req, res) => {
    res.render('lazy')
  })

  return router;
}

function checkAuth(req, res, next) {
  if (process.env.devmode == "true" ? false : !req.user) {
    res.status(406).send('ur not supost to be here')
  } else {
    next()
  }
}
