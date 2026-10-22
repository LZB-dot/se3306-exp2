// 训练5：useEffect 三种依赖形态 + 闭包陷阱
import { useState, useEffect, useRef } from 'react';

export default function Ex5Effect() {
  const [count, setCount] = useState(0);
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState([]);

  // 1 依赖 [count]：count 变了才重跑，顺便改标题
  useEffect(() => {
    document.title = 'count = ' + count;
  }, [count]);

  // 2 依赖 []：只在挂载时跑一次，用 ref 记录执行次数不影响渲染
  const mountCount = useRef(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  useEffect(() => {
    mountCount.current += 1;
    setLogs((l) => [...l, '空依赖 [] 的 effect 执行了第 ' + mountCount.current + ' 次']);
  }, []);

  // 3 定时器：每秒 +1，卸载/依赖变化时清理，不清理会重复叠加定时器
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer); // 清理函数
  }, []);

  // 4 闭包陷阱：setTimeout 里读到的 count 是「点击那一刻的快照」
  function trapWithSnapshot() {
    setTimeout(() => {
      setLogs((l) => [...l, '闭包旧值：打印 ' + count]);
    }, 1000);
  }

  // 修复：用函数式更新，拿到的是最新值而不是快照
  function fixWithUpdater() {
    setTimeout(() => {
      setCount((c) => {
        setLogs((l) => [...l, '函数式更新：拿到 ' + c]);
        return c;
      });
    }, 1000);
  }

  return (
    <div className="ex">
      <section className="block">
        <h3>1-2 依赖数组三种形态</h3>
        <p className="value">
          count = {count} ｜ 本组件已渲染 {renderCount.current} 次 ｜ 每秒 tick = {tick}
        </p>
        <button className="btn" onClick={() => setCount(count + 1)}>
          count + 1
        </button>
        <p className="hint">
          不写依赖 = 每次渲染都跑；写 [] = 只跑一次；写 [count] = count 变化才跑。
        </p>
      </section>

      <section className="block">
        <h3>4 闭包陷阱（连点 3 次，等 1 秒看结果）</h3>
        <button className="btn" onClick={trapWithSnapshot}>
          打印 count（有陷阱）
        </button>
        <button className="btn btn-primary" onClick={fixWithUpdater}>
          打印 count（函数式更新修复）
        </button>
      </section>

      <ul className="log">
        {logs.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <p className="note">依赖数组告诉 React 什么时候重跑；effect 里的变量是那次渲染的快照，想拿最新值要用函数式更新。</p>
    </div>
  );
}
