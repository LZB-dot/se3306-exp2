// ============================================================
// 这是任务6里让 AI「自由发挥」生成的博客组件原始版本，仅作审查素材存档。
// 它不参与构建（放在 docs/ 下，Vite 不会打包），最终版本见 src/ 下拆分后的组件。
// 提示词只有一句：「帮我写一个 React 博客组件，能发文章、看列表、按分类筛选」。
// ============================================================
import { useState, useEffect } from 'react';

export default function BlogAllInOne() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('技术');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('全部');
  const [total, setTotal] = useState(0);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const saved = localStorage.getItem('posts');
    if (saved) {
      setPosts(JSON.parse(saved));
      setTotal(JSON.parse(saved).length);
    }
    setLoading(false);
  }, []);

  // 只把 currentCategory 放进依赖：posts 变了这里不会重跑
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [currentCategory]);

  // 空列表并且正在加载时提前返回，条件分支里又调了一个 Hook
  if (posts.length === 0 && loading) {
    const [tip, setTip] = useState('加载中…');
    return <p>{tip}</p>;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !content) {
      setError('标题和正文不能为空');
      return;
    }
    const post = {
      id: Date.now(),
      title,
      category,
      summary,
      content,
      publishedAt: new Date().toLocaleDateString()
    };
    // 直接 push 原数组，再 setPosts 同一个引用
    posts.push(post);
    setPosts(posts);
    setTotal(posts.length);
    setFilteredPosts(posts);
    setTitle('');
    setSummary('');
    setContent('');
  }

  function handleDelete(id) {
    // splice 原地改
    const idx = posts.findIndex((p) => p.id === id);
    posts.splice(idx, 1);
    setPosts(posts);
    setTotal(posts.length);
    setFilteredPosts(posts);
  }

  function handleFilter(c) {
    setCurrentCategory(c);
    if (c === '全部') setFilteredPosts(posts);
    else setFilteredPosts(posts.filter((p) => p.category === c));
  }

  function handleEdit(post) {
    setEditing(post);
    setTitle(post.title);
    setCategory(post.category);
    setSummary(post.summary);
    setContent(post.content);
  }

  function handleSave() {
    const next = posts.map((p) =>
      p.id === editing.id ? { ...p, title, category, summary, content } : p
    );
    setPosts(next);
    setFilteredPosts(next);
    setEditing(null);
  }

  return (
    <div>
      <h1>我的博客</h1>
      <p>共 {total} 篇</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>技术</option>
          <option>随笔</option>
          <option>生活</option>
        </select>
        <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="摘要" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="正文" />
        <button type="submit">{editing ? '保存' : '发布'}</button>
      </form>

      <div>
        {['全部', '技术', '随笔', '生活'].map((c) => (
          <button key={c} onClick={() => handleFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {viewing ? (
        <div>
          <button onClick={() => setViewing(null)}>返回</button>
          <h2>{viewing.title}</h2>
          <p>{viewing.category}</p>
          <p>{viewing.publishedAt}</p>
          <div>{viewing.content}</div>
          <button onClick={() => handleEdit(viewing)}>编辑</button>
          <button onClick={() => handleDelete(viewing.id)}>删除</button>
          {editing && <button onClick={handleSave}>保存修改</button>}
        </div>
      ) : (
        <div>
          {filteredPosts.map((p, i) => (
            <div key={i} onClick={() => setViewing(p)}>
              <h3>{p.title}</h3>
              <span>{p.category}</span>
              <p>{p.summary || p.content.slice(0, 60)}</p>
              <span>{p.publishedAt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
