const { Post, validate } = require('../models/post');
const { User } = require('../models/user');
const { Portion } = require('../models/portion');

const express = require('express');
const router = express.Router();

// get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find()
    .populate('host')
    .populate('participants')
    .sort('host');

  res.send(posts);
});

// get post by id
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('host')
    .populate('participants');
  
  if (!post) return res.status(404).send(`ID ${req.params.id} is not found`);
  
  res.send(post);
});

// create post
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  
  if (error) return res.status(400).send(error.message);

  let post = new post(req.body);
  post = await post.save();

  res.send(post);
});

// update post
router.patch('/:id', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.message);

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(post);
});

// delete post
router.delete('/:id', async (req, res) => {
  let post = await Post.findByIdAndDelete(req.params.id);

  await User.update( { posts_host: post.host }, { $pullAll: { posts_host: post.host } } );
  post.participants.forEach(portion_id => {
    await Portion.findByIdAndDelete(portion_id);
  });

  res.send(post);
});

module.exports = router;