// 任务2 基础训练营：六个渐进练习汇总
import { useState } from 'react';
import Ex1JSX from './Ex1JSX';
import Ex2ES6 from './Ex2ES6';
import Ex3State from './Ex3State';
import Ex4Key from './Ex4Key';
import Ex5Effect from './Ex5Effect';
import Ex6Hook from './Ex6Hook';

const LIST = [
  { key: 'ex1', title: '训练1 · JSX 三件套', Comp: Ex1JSX, goal: '变量插值、className、列表渲染' },
  { key: 'ex2', title: '训练2 · ES6 七语法', Comp: Ex2ES6, goal: '箭头、解构、展开、map/filter/find、模板字符串' },
  { key: 'ex3', title: '训练3 · useState 四连', Comp: Ex3State, goal: '计数器、受控输入、开关、数组增删改' },
  { key: 'ex4', title: '训练4 · 列表与 key', Comp: Ex4Key, goal: 'index 作 key 的串位坑' },
  { key: 'ex5', title: '训练5 · useEffect', Comp: Ex5Effect, goal: '三种依赖形态与闭包陷阱' },
  { key: 'ex6', title: '训练6 · 自定义 Hook', Comp: Ex6Hook, goal: '手写 useWindowSize' }
];

export default function Training() {
  const [cur, setCur] = useState('ex1');
  const active = LIST.find((x) => x.key === cur);
  const Comp = active.Comp;

  return (
    <div className="training">
      <div className="subtabs">
        {LIST.map((x) => (
          <button
            key={x.key}
            className={'tab' + (cur === x.key ? ' tab-active' : '')}
            onClick={() => setCur(x.key)}
          >
            {x.title}
          </button>
        ))}
      </div>
      <p className="goal">目标：{active.goal}</p>
      <Comp />
    </div>
  );
}
