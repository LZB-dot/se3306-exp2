// src/components/Header.jsx —— 顶部标题栏
// 文章总数与各分类数量都是「从 posts 算出来的」，不单独设 state（第 10 步：避免冗余 state）
export default function Header({ total, categories }) {
  return (
    <header className="header">
      <h1 className="blog-title">我的博客</h1>
      <p className="blog-meta">
        共 {total} 篇文章 · {categories} 个分类
      </p>
    </header>
  );
}
