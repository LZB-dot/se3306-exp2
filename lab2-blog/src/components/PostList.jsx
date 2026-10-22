// src/components/PostList.jsx —— 文章列表
// 第 6 步：map 渲染，key 用 post.id 而不是数组下标
import PostItem from './PostItem';

export default function PostList({ posts, onOpen }) {
  // 第 5 步：空态提示
  if (posts.length === 0) {
    return <p className="empty">还没有文章，写下第一篇吧</p>;
  }

  return (
    <div className="list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onOpen={onOpen} />
      ))}
    </div>
  );
}
