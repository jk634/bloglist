const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, blogsInDb } = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('all blogs are returned and as json', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(res.body).toHaveLength(initialBlogs.length);
});

// prettier-ignore
test('blog\'s identifier name is id', async () => {
  const response = await api.get('/api/blogs');
  response.body.map((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new blog adding test',
    author: 'tester x',
    url: 'www.test.com',
    likes: 21,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

  const title = blogsAtEnd.map((b) => b.title);
  expect(title).toContain('new blog adding test');
});

test('when likes are not given returns zero', async () => {
  const newBlogNoLikes = {
    title: 'without likes',
    author: 'tester y',
    url: 'www.nolikesgiven.com',
  };

  const result = await api
    .post('/api/blogs')
    .send(newBlogNoLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(result.body.likes).toBe(0);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
});

test('when title and url are missing returns bad request', async () => {
  const brokenBlog = {
    author: 'tester x',
    likes: 21,
  };

  await api.post('/api/blogs').send(brokenBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
