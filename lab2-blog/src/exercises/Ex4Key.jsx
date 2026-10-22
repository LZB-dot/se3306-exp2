// 训练4：列表 + key —— 亲眼看到 index 作 key 的串位坑
// 关键：输入框必须是非受控的（文字存在 DOM 里），受控输入不会串位，
// 因为 React 每次渲染都会把 value 强制同步回去，坑就被掩盖了
import { useState } from 'react';

const initial = [
  { id: 'a', text: '第一项' },
  { id: 'b', text: '第二项' },
  { id: 'c', text: '第三项' }
];

export default function Ex4Key() {
  const [items, setItems] = useState(initial);
  const [useIdKey, setUseIdKey] = useState(false); // false = 用 index 作 key

  function removeFirst() {
    setItems(items.slice(1)); // 删掉第一项
  }

  function reset() {
    setItems(initial);
    // 非受控输入的文字存在 DOM 里，重置只能整页刷新
    location.reload();
  }

  return (
    <div className="ex">
      <div className="switch-row">
        <label className="switch">
          <input type="checkbox" checked={useIdKey} onChange={(e) => setUseIdKey(e.target.checked)} />
          用 id 作 key（勾选后串位现象消失）
        </label>
        <button className="btn" onClick={removeFirst}>
          删除第一项
        </button>
        <button className="btn" onClick={reset}>
          重置
        </button>
      </div>

      <p className="hint">操作顺序：在三个输入框里分别输入不同文字 → 点「删除第一项」→ 观察剩下的输入框：index 作 key 时文字会串位，id 作 key 时不会。</p>

      <ul className="post-list">
        {items.map((it, i) => (
          <li key={useIdKey ? it.id : i}>
            <input className="input" placeholder={it.text} />
            <span className="keytag">key={useIdKey ? 'id' : 'index'}</span>
          </li>
        ))}
      </ul>

      <p className="note">
        key 的作用是给 React 认节点：index 作 key 时删除第一项，剩下的节点「身份」整体前移，React
        复用了错误的 DOM，输入框里的旧文字就串了位；id 作 key 时节点身份稳定，不会串。
      </p>
    </div>
  );
}
