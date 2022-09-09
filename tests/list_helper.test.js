const listHelper = require('../utils/list_helper');
const {
  blogs,
  listWithOneBlog,
  likesIsWrongTypeBlog,
  testBlog,
  mostLikesBlog,
} = require('./testBlogs');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when given type is wrong is null', () => {
    const result = listHelper.totalLikes(likesIsWrongTypeBlog);
    expect(result).toBe(null);
  });
});

describe('favorite blog', () => {
  test('equals the right result', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(mostLikesBlog);
  });

  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual(testBlog);
  });
});

describe('most blogs', () => {
  test('equals the right result', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });

  test('of empty list is zero', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual(testBlog);
  });
});
