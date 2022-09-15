const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const initialBlogs = [
  {
    title: 'Good blog',
    author: 'Mikko Niittymäki',
    url: 'www.jotain.com',
    likes: 100,
  },
  {
    title: 'Even better blog',
    author: 'Juha Koskinen',
    url: 'www.testing.com',
    likes: 59,
  },
];

const newBlog = {
  title: 'new blog adding test',
  author: 'tester x',
  url: 'www.test.com',
  likes: 21,
};

const usersInitialization = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('salasana', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
};

const rootToken = async () => {
  const loginRes = await api
    .post('/api/login')
    .send({ username: 'root', password: 'salasana' })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return loginRes.body.token;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  usersInitialization,
  rootToken,
  newBlog,
};
