// src/useLocalStorage.js —— 第 12 步：自定义 Hook，给 useState 加持久化
// 自定义 Hook 就是「名字以 use 开头的普通函数」，复用的是逻辑而不是界面
import { useState, useEffect } from 'react';

function useLocalStorage(key, initial) {
  // 惰性初始化：只有首次渲染才读 localStorage，之后的重渲染不会再读
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved === null ? initial : JSON.parse(saved); // 惰性读 + JSON 还原
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)); // 值变了 JSON 写入
  }, [key, value]);

  return [value, setValue]; // 返回值跟 useState 一样，调用方无感替换
}

export default useLocalStorage;
