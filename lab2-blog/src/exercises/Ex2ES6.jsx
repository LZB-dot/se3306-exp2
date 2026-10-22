// 训练2：ES6 语法微练习 —— 博客开发最常用的七个语法
const add = (a, b) => a + b; // 1 箭头函数

const post = { id: 1, title: '第一篇', category: '技术' };
const { title, category } = post; // 2 解构

const posts = [{ id: 1 }, { id: 2 }];
const newPost = { id: 3 };
const nextPosts = [newPost, ...posts]; // 3 展开：新数组，不改原数组

const postList = [
  { id: 1, title: '第一篇', category: '技术' },
  { id: 2, title: '第二篇', category: '随笔' },
  { id: 3, title: '第三篇', category: '技术' }
];

export default function Ex2ES6() {
  const titles = postList.map((p) => p.title);                  // 4 map
  const techOnly = postList.filter((p) => p.category === '技术'); // 5 filter
  const found = postList.find((p) => p.id === 2);                // 6 find
  const label = `文章：${title}，分类：${category}`;              // 7 模板字符串

  return (
    <div className="ex">
      <pre className="code">{`add(1, 2) = ${add(1, 2)}`}</pre>
      <pre className="code">{`解构：title=${title}，category=${category}`}</pre>
      <pre className="code">{`展开后：${JSON.stringify(nextPosts)}`}</pre>
      <pre className="code">{`map 标题：${JSON.stringify(titles)}`}</pre>
      <pre className="code">{`filter 技术类：${JSON.stringify(techOnly.map((p) => p.title))}`}</pre>
      <pre className="code">{`find id=2：${JSON.stringify(found)}`}</pre>
      <pre className="code">{label}</pre>
      <p className="note">博客开发最常用的 ES6 语法是展开与 map。</p>
    </div>
  );
}
