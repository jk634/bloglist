const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    let body = request.body;

    if (!body.likes) {
      request.body.likes = 0;
    }
    if (!body.title && !body.url) {
      response.status(400).end();
      return;
    }

    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token;
    const blog = await Blog.findById(request.params.id);
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (blog.user.toString() === decodedToken.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    }
  } catch (err) {
    next(err);
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
