// src/api/posts.js —— 博客接口定义（标准后台 REST 接口）
// post 结构约定：{ id: string, title, category, summary, content, publishedAt }
import { http } from './client';

export const listPosts = (category) =>
  http.get('/posts' + (category && category !== '全部' ? '?category=' + category : ''));

export const getPost = (id) => http.get('/posts/' + id);

export const createPost = (post) => http.post('/posts', post);

export const updatePost = (id, post) => http.put('/posts/' + id, post);

export const deletePost = (id) => http.del('/posts/' + id);
