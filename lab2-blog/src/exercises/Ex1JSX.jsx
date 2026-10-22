// 训练1：JSX 基础三件套 —— 变量插值、className、列表渲染
export default function Ex1JSX() {
  const name = '我的博客';
  const posts = ['第一篇', '第二篇', '第三篇'];

  // key 用序号：列表顺序固定且不会增删重排时可用；能重排时要用稳定的 id
  return (
    <div className="ex">
      <h1>欢迎来到{name}</h1>
      <ul className="post-list">
        {posts.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <p className="note">JSX 里变量和表达式写在花括号里。</p>
    </div>
  );
}
