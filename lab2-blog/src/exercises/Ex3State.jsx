// 训练3：useState 四连 —— 计数器 / 受控输入 / 开关 / 数组增删改
import { useState } from 'react';

export default function Ex3State() {
  const [count, setCount] = useState(0);        // 1 计数器
  const [text, setText] = useState('');         // 2 受控输入
  const [on, setOn] = useState(true);           // 3 开关

  // 4 数组增删改：全部用新数组，不用 push / splice
  const [items, setItems] = useState(['苹果', '香蕉']);
  const [draft, setDraft] = useState('');

  function addItem() {
    if (!draft.trim()) return;
    setItems([...items, draft]); // 加：展开生成新数组
    setDraft('');
  }
  function removeItem(i) {
    setItems(items.filter((_, idx) => idx !== i)); // 删：filter 出新数组
  }
  function editItem(i) {
    setItems(items.map((it, idx) => (idx === i ? it + '（已修改）' : it))); // 改：map 出新数组
  }

  return (
    <div className="ex">
      <section className="block">
        <h3>1 计数器</h3>
        <button className="btn" onClick={() => setCount(count + 1)}>
          点一次加 1
        </button>
        <span className="value">count = {count}</span>
      </section>

      <section className="block">
        <h3>2 受控输入</h3>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="输入点什么" />
        <p className="value">你输入了：{text}</p>
      </section>

      <section className="block">
        <h3>3 开关</h3>
        <button className="btn" onClick={() => setOn(!on)}>
          {on ? '开' : '关'}
        </button>
      </section>

      <section className="block">
        <h3>4 数组增删改</h3>
        <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="新项目" />
        <button className="btn btn-primary" onClick={addItem}>
          加一项
        </button>
        <ul className="post-list">
          {items.map((it, i) => (
            <li key={it + i}>
              {it}
              <button className="btn" onClick={() => editItem(i)}>
                改
              </button>
              <button className="btn" onClick={() => removeItem(i)}>
                删
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="note">数组要用新数组替换：React 靠引用变化判断要不要重渲染，push 改的是同一个引用。</p>
    </div>
  );
}
