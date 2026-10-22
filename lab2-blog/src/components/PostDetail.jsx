// src/components/PostDetail.jsx —— 详情页：读全文 + 编辑 / 删除
export default function PostDetail({ post, onBack, onEdit, onDelete }) {
  if (!post) return null;

  return (
    <div className="detail">
      <button className="btn btn-back" onClick={onBack}>
        ← 返回列表
      </button>
      <h2 className="detail-title">{post.title}</h2>
      <p className="detail-meta">
        <span className={'badge badge-' + post.category}>{post.category}</span>
        <span className="detail-date">{post.publishedAt}</span>
      </p>
      <div className="detail-content">{post.content}</div>
      <div className="form-actions">
        <button className="btn" onClick={() => onEdit(post)}>
          编辑
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(post.id)}>
          删除
        </button>
      </div>
    </div>
  );
}
