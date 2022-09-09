const Blog = require('../models/blog');

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

module.exports = {
  initialBlogs,
  blogsInDb,
};
