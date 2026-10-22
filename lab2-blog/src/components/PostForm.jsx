// src/components/PostForm.jsx —— 写文章表单（受控）
// 四个字段合成一个对象 state；发布与编辑复用同一个表单
import { useState, useEffect } from 'react';

const EMPTY = { title: '', category: '技术', summary: '', content: '' };

export default function PostForm({ onSubmit, editingPost, onCancelEdit }) {
  const [draft, setDraft] = useState(EMPTY);

  // 编辑时把文章回填进表单；取消编辑后清空
  useEffect(() => {
    setDraft(editingPost ? { ...editingPost } : EMPTY);
  }, [editingPost]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value })); // 对象是新的，不原地改
  }

  // 第 7 步：阻止表单默认刷新
  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;
    onSubmit(draft);
    setDraft(EMPTY);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={draft.title}
        onChange={handleChange}
        placeholder="文章标题"
        className="input"
      />
      <select name="category" value={draft.category} onChange={handleChange} className="input">
        <option value="技术">技术</option>
        <option value="随笔">随笔</option>
        <option value="生活">生活</option>
      </select>
      <input
        name="summary"
        value={draft.summary}
        onChange={handleChange}
        placeholder="摘要（可留空，自动取正文前 60 字）"
        className="input"
      />
      <textarea
        name="content"
        value={draft.content}
        onChange={handleChange}
        placeholder="正文内容"
        rows={4}
        className="input"
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingPost ? '保存修改' : '发布文章'}
        </button>
        {editingPost && (
          <button type="button" className="btn" onClick={onCancelEdit}>
            取消编辑
          </button>
        )}
      </div>
    </form>
  );
}
