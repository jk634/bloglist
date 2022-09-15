const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {
  initialBlogs,
  blogsInDb,
  usersInDb,
  usersInitialization,
  rootToken,
  newBlog,
} = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
  await usersInitialization();
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
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${await rootToken()}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

  const title = blogsAtEnd.map((b) => b.title);
  expect(title).toContain('new blog adding test');
});

// prettier-ignore
test('a blog can\'t be added if token isn\'t given', async () => {
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test('when likes are not given returns zero', async () => {
  const newBlogNoLikes = {
    title: 'without likes',
    author: 'tester y',
    url: 'www.nolikesgiven.com',
  };

  const result = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${await rootToken()}`)
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
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${await rootToken()}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await blogsInDb();
  const blogToDelete = blogs[2];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${await rootToken()}`)
    .expect(204);

  const blogsAtEnd = await blogsInDb();

  expect(blogsAtEnd).toHaveLength(initialBlogs.length);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test('a specific blog can be updated', async () => {
  const blogs = await blogsInDb();
  const blogToUpdate = blogs[0];

  const updatedBlog = blogToUpdate;
  updatedBlog.likes += 10;

  const result = await api.put(`/api/blogs/${updatedBlog.id}`).expect(200);

  expect(blogToUpdate.likes).toBe(result.body.likes + 10);
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await usersInitialization();
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

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
