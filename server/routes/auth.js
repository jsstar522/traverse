const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models/user');

const router = express.Router();

// Account signup router
router.post('/register', isNotLoggedIn, async (req, res, next) => {
  const {email, password} = req.body;
  try {
    //찾지 못했을 시 빈 배열로 출력
    const exUser = await User.find({ email: email });
    if (exUser.length != 0) {
      req.flash('registerError', '이미 가입된 이메일입니다.');
      console.log('이미가입된 이메일');
      console.log(exUser)
      return res.redirect('/register');
    }
    // const rebody = Object.keys(req.body).map(async (key) => {    
    //   if (key === 'password')
    //     return { key: await bcrypt.hash(req.body[password], 12)}
    //   else return { key: req.body[key] };
    // });

    // Create Object to wirte on database
    let rebody = new Object();

    await Object.keys(req.body).map((key)=>{
      if (key === 'password')
        rebody[key] = bcrypt.hash(req.body[password], 12);      
      rebody[key] = req.body[key];    
    });

    let user = new User(rebody);
    user = await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// Account signin router
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.status(404).json(info.message);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json(user);
    });
  })(req, res, next);
});

// Account logout router
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
})

// AUTH
router.get('/kakao', passport.authenticate('kakao'));
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;