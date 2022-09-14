const Blog = require('../models/blog');
const User = require('../models/user');

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
};
