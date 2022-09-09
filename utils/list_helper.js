var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  let likesIsWrongType = false;

  if (blogs.length === 0) {
    return 0;
  } else {
    blogs.map((blog) => {
      if (typeof blog.likes !== 'number') {
        likesIsWrongType = true;
        return;
      } else {
        likes += blog.likes;
      }
    });
    if (likesIsWrongType) return null;
    return likes;
  }
};

const favoriteBlog = (blogs) => {
  let mostLikes = 0;
  let fvrtBlog = '';

  if (blogs.length === 0) {
    return 0;
  } else {
    blogs.map((blog) => {
      if (blog.likes > mostLikes) {
        mostLikes = blog.likes;
        fvrtBlog = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
        };
      }
    });
  }
  return fvrtBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } else {
    let x = _.keyBy(blogs, 'author');
    let array = [];

    for (let auth in x) {
      array.push({
        author: auth,
        blogs: 0,
      });
    }

    blogs.map((blog) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].author === blog.author) {
          array[i].blogs += 1;
        }
      }
    });

    const _mostBlogs = array.reduce((prev, current) => {
      return prev.blogs > current.blogs ? prev : current;
    });

    return _mostBlogs;
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
