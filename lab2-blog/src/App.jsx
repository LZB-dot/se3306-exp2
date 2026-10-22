// src/App.jsx —— 把各组件拼起来
import { useState, useMemo } from 'react';
import usePostStore from './usePostStore';
import Header from './components/Header';
import PostForm from './components/PostForm';
import CategoryFilter from './components/CategoryFilter';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import RemotePosts from './RemotePosts';
import Training from './exercises/Training';
import FilterableProductTable from './thinking/FilterableProductTable';

const TABS = [
  { key: 'blog', label: '我的博客' },
  { key: 'remote', label: '远程文章（Query）' },
  { key: 'training', label: '基础训练 1-6' },
  { key: 'thinking', label: 'Thinking in React' }
];

export default function App() {
  // 精确订阅：每个字段单独取，posts 变化时不会把无关组件也带崩
  const posts = usePostStore((s) => s.posts);
  const publish = usePostStore((s) => s.publish);
  const update = usePostStore((s) => s.update);
  const remove = usePostStore((s) => s.remove);

  // 第 11 步：这两个 state 提升到共同父组件 App，子组件靠 props + 回调改
  const [category, setCategory] = useState('全部');
  const [viewingId, setViewingId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [tab, setTab] = useState('blog');

  // 第 10 步：分类列表、文章总数都由 posts 推导，不单独设 state
  const categories = useMemo(() => ['全部', ...new Set(posts.map((p) => p.category))], [posts]);
  const visiblePosts = category === '全部' ? posts : posts.filter((p) => p.category === category);
  const viewingPost = posts.find((p) => p.id === viewingId) || null;

  function handleSubmit(draft) {
    if (editingPost) {
      update(editingPost.id, draft);
      setEditingPost(null);
      setViewingId(editingPost.id);
    } else {
      publish(draft);
    }
  }

  function handleDelete(id) {
    remove(id);
    setViewingId(null);
    setEditingPost(null);
  }

  return (
    <div className="app">
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={'tab' + (tab === t.key ? ' tab-active' : '')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'blog' && (
        <>
          {/* 总数与分类数都是算出来的，不是 state */}
          <Header total={posts.length} categories={categories.length - 1} />
          <PostForm onSubmit={handleSubmit} editingPost={editingPost} onCancelEdit={() => setEditingPost(null)} />
          {viewingPost ? (
            <PostDetail
              post={viewingPost}
              onBack={() => setViewingId(null)}
              onEdit={(p) => setEditingPost(p)}
              onDelete={handleDelete}
            />
          ) : (
            <>
              <CategoryFilter categories={categories} active={category} onChange={setCategory} />
              <PostList posts={visiblePosts} onOpen={setViewingId} />
            </>
          )}
        </>
      )}

      {tab === 'remote' && <RemotePosts />}
      {tab === 'training' && <Training />}
      {tab === 'thinking' && <FilterableProductTable />}
    </div>
  );
}
