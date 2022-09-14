const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper');
const bcrypt = require('bcryptjs');
const Blog = require('../models/blog');
const User = require('../models/user');

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

test('a blog can be deleted', async () => {
  const blogsAtStart = await blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await blogsInDb();

  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test('a specific blog can be updated', async () => {
  const blogs = await blogsInDb();
  const blogToUpdate = blogs[0];

  console.log(blogToUpdate);
  const updatedBlog = blogToUpdate;
  updatedBlog.likes += 10;
  console.log(updatedBlog);

  const result = await api.put(`/api/blogs/${updatedBlog.id}`).expect(200);

  expect(blogToUpdate.likes).toBe(result.body.likes + 10);
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();
    console.log(usersAtStart);

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
