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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
