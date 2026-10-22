// 训练6：自定义 Hook —— useWindowSize
// 自定义 Hook 就是「以 use 开头的普通函数」，复用的是逻辑不是界面
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // 卸载时清理，不清理会泄漏
  }, []);

  return size;
}

export default function Ex6Hook() {
  const { width, height } = useWindowSize();

  return (
    <div className="ex">
      <p className="value">
        窗口宽度：{width} px ｜ 窗口高度：{height} px
      </p>
      <p className="hint">拖动浏览器窗口大小，上面的数字会实时变化。</p>
      <p className="note">
        必须以 use 开头：React 靠这个命名约定判断「这是 Hook」，从而校验调用顺序；不这么写，
        Hooks 规则检查与 lint 规则就失效了。
      </p>
    </div>
  );
}
