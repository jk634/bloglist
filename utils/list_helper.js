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

module.exports = {
  dummy,
  totalLikes,
};
