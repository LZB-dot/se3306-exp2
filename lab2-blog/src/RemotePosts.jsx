// src/RemotePosts.jsx —— 任务5：服务端状态（数据来自 json-server 本地 mock 后台）
// 客户端状态 vs 服务端状态：这里的文章不在浏览器里，浏览器只是缓存副本
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function RemotePosts() {
  const qc = useQueryClient();

  // 用于演示「失败回滚」：把端口故意改错，请求必然失败
  const [badPort, setBadPort] = useState(false);
  const port = badPort ? 3999 : 3000;
  const API = `http://localhost:${port}/posts`;

  // 三态：isPending / isError / success(data)
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['posts', port], // 端口变化要重新取，故放进 key；它每次渲染都稳定
    queryFn: () => fetch(API + '?_limit=10').then((r) => r.json())
  });

  const addPost = useMutation({
    mutationFn: (post) =>
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      }).then((r) => r.json()),

    // ① 取消旧查询 + 快照旧列表
    onMutate: async (post) => {
      await qc.cancelQueries({ queryKey: ['posts', port] });
      const prev = qc.getQueryData(['posts', port]);
      // ② 乐观插入：不等服务器响应，界面先秒出
      qc.setQueryData(['posts', port], (old) => [{ ...post, id: 'tmp-' + Date.now() }, ...(old || [])]);
      return { prev };
    },
    // ③ 失败回滚：把快照放回
    onError: (_e, _t, ctx) => qc.setQueryData(['posts', port], ctx.prev),
    // ④ 重新拉取，与服务器对齐
    onSettled: () => qc.invalidateQueries({ queryKey: ['posts', port] })
  });

  const [title, setTitle] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    addPost.mutate({ title, category: '随笔', summary: '乐观更新插入', content: '……', publishedAt: new Date().toISOString().slice(0, 10) });
    setTitle('');
  }

  return (
    <div className="remote">
      <p className="tip">
        数据来自 <code>json-server db.json --port 3000 --delay 500</code>，增删会真实写回 db.json。
      </p>

      <div className="switch-row">
        <label className="switch">
          <input type="checkbox" checked={badPort} onChange={(e) => setBadPort(e.target.checked)} />
          把端口改成 3999（制造失败，验证回滚）
        </label>
        {isFetching && <span className="fetching">同步中…</span>}
      </div>

      <form className="inline-form" onSubmit={handleAdd}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="快速发布一篇（乐观更新）"
        />
        <button className="btn btn-primary" type="submit">
          发布
        </button>
      </form>

      {isPending && <p className="empty">加载中…（pending 态）</p>}
      {isError && <p className="error">出错了：{error.message}（error 态）</p>}

      {!isPending && !isError && (
        <ul className="remote-list">
          {data.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <span className={'badge badge-' + p.category}>{p.category}</span>
              <span className="card-date">{p.publishedAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
