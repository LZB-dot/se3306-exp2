// src/usePostStore.js —— 任务5：useState / useLocalStorage 升级为 Zustand 全局 store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePostStore = create(
  persist(
    (set) => ({
      posts: [],

      // 发布：新文章插到最前面，生成 id 与发布时间
      publish: (post) =>
        set((s) => ({
          posts: [
            { ...post, id: crypto.randomUUID(), publishedAt: new Date().toISOString().slice(0, 10) },
            ...s.posts
          ]
        })),

      // 编辑：只改命中的那一条，其余保持原引用
      update: (id, patch) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p))
        })),

      // 删除：filter 出新数组
      remove: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) }))
    }),
    {
      name: 'posts', // localStorage 里的键名
      // 只持久化数据，不把三个函数也序列化进去（函数 JSON.stringify 会被丢掉）
      partialize: (s) => ({ posts: s.posts })
    }
  )
);

export default usePostStore;
