// src/api/client.js —— 统一请求封装（接入自己后台 = 只改 BASE_URL）
import { mockRequest } from './mock';

const BASE_URL = '';              // 接入自己后台时填 "https://你的域名/api"
const USE_MOCK = BASE_URL === ''; // 空地址 = 使用模拟后台数据

export async function request(path, options = {}) {
  if (USE_MOCK) {
    // 模拟后台同样返回统一信封 { code, message, data }，必须解出 data 再返回，
    // 否则调用方拿到的是整个信封，posts.map 会报 posts.map is not a function
    const mockBody = await mockRequest(path, options);
    if (mockBody.code !== 0) throw new Error(mockBody.message);
    return mockBody.data;
  }

  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await res.json(); // 统一响应 { code, message, data }
  if (body.code !== 0) throw new Error(body.message);
  return body.data;
}

export const http = {
  get: (p) => request(p),
  post: (p, d) => request(p, { method: 'POST', body: JSON.stringify(d) }),
  put: (p, d) => request(p, { method: 'PUT', body: JSON.stringify(d) }),
  del: (p) => request(p, { method: 'DELETE' })
};
