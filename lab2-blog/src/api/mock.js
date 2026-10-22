// src/api/mock.js —— 模拟后台（4 篇示例文章；接入真实后台后删除本文件即可）
// 之所以先写 mock：先把「数据长什么样」定下来，再去写渲染它的代码
const db = {
  posts: [
    { id: '1', title: '我的第一篇博客', category: '技术', summary: 'React 上手记录', content: '从 create-vite 到第一个组件，一步一步来。', publishedAt: '2026-09-01' },
    { id: '2', title: '为什么学前端框架', category: '随笔', summary: '框架的价值', content: '组件化让界面像积木一样拼装。', publishedAt: '2026-09-03' },
    { id: '3', title: '状态管理小抄', category: '技术', summary: 'useState 到 Zustand', content: '组件内 useState，跨组件状态提升，全局 Zustand。', publishedAt: '2026-09-05' },
    { id: '4', title: '部署上线记', category: '生活', summary: '静态托管 5 分钟上线', content: 'pnpm build 之后把 dist 传上去。', publishedAt: '2026-09-07' }
  ]
};

export function mockRequest(path, options = {}) {
  return new Promise((resolve) =>
    setTimeout(() => {
      const method = options.method || 'GET';
      const [pathname, queryString] = path.split('?'); // 拆出路径与查询串
      const id = pathname.split('/')[2];               // /posts/:id 里的 id
      const params = new URLSearchParams(queryString || '');
      const category = params.get('category');

      let data = null;

      if (method === 'GET') {
        if (id) data = db.posts.find((p) => p.id === id);
        else if (category && category !== '全部') data = db.posts.filter((p) => p.category === category);
        else data = [...db.posts];
      } else if (method === 'POST') {
        // 发布：body 是 JSON 字符串
        const post = {
          ...JSON.parse(options.body),
          id: String(Date.now()),
          publishedAt: new Date().toISOString().slice(0, 10)
        };
        db.posts = [post, ...db.posts]; // 新数组替换，不 push
        data = post;
      } else if (method === 'PUT') {
        db.posts = db.posts.map((p) => (p.id === id ? { ...p, ...JSON.parse(options.body) } : p));
        data = db.posts.find((p) => p.id === id);
      } else if (method === 'DELETE') {
        db.posts = db.posts.filter((p) => p.id !== id);
        data = { id };
      }

      resolve({ code: 0, message: 'ok', data });
    }, 300)
  ); // 300ms 延迟，模拟真实网络
}
