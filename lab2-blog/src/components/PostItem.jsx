// src/components/PostItem.jsx —— 单张文章卡片
// 数据全部通过 props 进来，组件内不写死任何文章（第 4 步）
export default function PostItem({ post, onOpen }) {
  // 第 5 步 条件渲染：没写摘要就用正文前 60 字兜底
  const excerpt = post.summary || post.content.slice(0, 60);

  return (
    <article className="card" onClick={() => onOpen(post.id)}>
      <div className="card-head">
        <h2 className="card-title">{post.title}</h2>
        <span className={'badge badge-' + post.category}>{post.category}</span>
      </div>
      <p className="card-summary">{excerpt}</p>
      <p className="card-date">{post.publishedAt}</p>
    </article>
  );
}
