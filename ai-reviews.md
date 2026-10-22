# AI 代码审查记录（任务6）

| 项目 | 内容 |
| --- | --- |
| 课程 | SE3306《现代 Web 前端框架与工程化》 |
| 实验 | 实验二 · React 项目实战与 Zustand 状态管理 |
| 审查对象 | AI 生成的一体化博客组件（提示词：**「帮我写一个 React 博客组件，能发文章、看列表、按分类筛选」**，未附加任何约束） |
| 原始代码 | [`docs/ai-raw/BlogAllInOne.jsx`](./docs/ai-raw/BlogAllInOne.jsx)（不参与构建，仅作审查素材） |
| 整改后代码 | `lab2-blog/src/` 下拆分后的组件 + `usePostStore.js` + `useLocalStorage.js` |
| 审查依据 | <https://zh-hans.react.dev/reference/rules/rules-of-hooks> 等官方章节 |

> 说明：提示词故意不写要求，让 AI 自由发挥，这样才能得到「典型 AI 代码」的常见问题，审查才有意义。
> 每条按三件套记录：**问题代码原文 → 违反的官方规则 → 修改前后对比 → 修改后的运行时变化**。

---

## 0. AI 使用声明（任务书 §七：本实验的 AI 使用声明即本文件）

**使用范围**：

1. **任务 6 的审查素材**：按任务书要求让 AI 自由生成一版博客组件（提示词见上表），存档于 [`docs/ai-raw/BlogAllInOne.jsx`](./docs/ai-raw/BlogAllInOne.jsx)，作为五检查点的审查对象——这是 AI 代码**唯一**进入仓库的形态（不参与构建）。
2. **概念答疑与报错翻译**：解释 Hook 链表机制、persist 中间件行为、查询三态等概念；翻译报错信息。
3. **运行截图的自动化采集**：用无头浏览器脚本代替手工点击完成截图（脚本不在仓库内，截图均为真实运行结果）。

**本人完成的部分**：全部功能代码的手写与整改（`lab2-tic/`、`lab2-blog/src/` 全部源文件）、组件拆分方案、state 布局决策、五检查点的逐条审查与 diff 整改、本文档的结论与体会。AI 生成内容一律经过：运行 → 复现问题 → 对照官方文档 → 修改 → 复验，才进入 `src/`。

---

## 检查点 ① 组件职责：是否超 200 行、多职责？

**问题代码原文**（`BlogAllInOne.jsx` 全文 150 余行，且把表单、过滤、列表、详情、编辑、持久化全部塞进一个组件）：

```jsx
export default function BlogAllInOne() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  // …… 共 12 个 useState
  return (
    <div>
      <form onSubmit={handleSubmit}>…</form>      {/* 表单职责 */}
      <div>{['全部','技术','随笔','生活'].map(...)}</div>  {/* 过滤职责 */}
      {viewing ? <div>…</div> : <div>{filteredPosts.map(...)}</div>}  {/* 列表 + 详情职责 */}
    </div>
  );
}
```

**违反**：官方 <https://zh-hans.react.dev/learn/thinking-in-react> 的四步法要求先按 UI 拆组件树；单组件承担 6 种职责，任何一处改动都要动同一个文件，也无法单独复用。

**修改前后对比**：

```diff
- BlogAllInOne.jsx（150+ 行，12 个 useState，6 种职责）
+ src/App.jsx              仅做组装：订阅 store、提升 category/viewingId 两个 state
+ src/components/Header.jsx        标题栏（纯展示）
+ src/components/PostForm.jsx      表单（受控 + 发布/编辑复用）
+ src/components/CategoryFilter.jsx 分类过滤
+ src/components/PostList.jsx      列表（含空态）
+ src/components/PostItem.jsx      单卡片（含条件渲染）
+ src/components/PostDetail.jsx    详情 + 编辑/删除入口
+ src/usePostStore.js              状态层（Zustand + persist）
```

**运行时变化**：改动前改一处样式要在 150 行里翻；改动后每个文件 20-60 行。更直接的差别是「编辑」——原版把编辑态和列表态混在同一个 `viewing` 分支里，点编辑后表单和详情同时挂在一个页面；拆开后 `PostDetail` 只负责展示，`PostForm` 通过 `editingPost` 切换成编辑模式，两者不会互相干扰。审查后组件树见 `docs/screenshots/review-tree.png`。

---

## 检查点 ② Hook 调用顺序：是否在 if / for / 嵌套函数里调 Hook？

**问题代码原文**：

```jsx
// 空列表并且正在加载时提前返回，条件分支里又调了一个 Hook
if (posts.length === 0 && loading) {
  const [tip, setTip] = useState('加载中…');   // ← 条件分支里调 Hook
  return <p>{tip}</p>;
}
```

**违反**：官方 <https://zh-hans.react.dev/reference/rules/rules-of-hooks> 原文「不要在循环、条件或嵌套函数中调用 Hook」。Hook 是按**调用顺序编号**存进组件对应的 Hook 链表的：首渲染时这个组件登记了 12 个 Hook，某次 `posts.length === 0 && loading` 成立，提前 return 且多出一个 `useState`，编号整体错位，React 会把「第 13 个 Hook」的 state 接到别的 Hook 上，直接抛 `Rendered more hooks than during the previous render`。

这是**必然出错**而不是偶尔出错：只要两次渲染的 Hook 调用数量不同，React 就无法把 state 对上号。

**修改前后对比**：

```diff
- if (posts.length === 0 && loading) {
-   const [tip, setTip] = useState('加载中…');
-   return <p>{tip}</p>;
- }
+ // 所有 Hook 一律在组件顶层、无条件调用
+ const [badPort, setBadPort] = useState(false);
+ const { data, isPending, isError } = useQuery({ queryKey: ['posts', port], queryFn: … });
+
+ // 提前 return 放在所有 Hook 之后，且分支里不再调用任何 Hook
+ if (isPending) return <p>加载中…</p>;
```

**修改后运行时变化**：修改前在「列表为空 + loading」这一帧切换时控制台报 `Rendered more hooks than during the previous render`，页面白屏；修改后无论数据处于 pending / error / success 哪一态，Hook 数量恒定，三态切换只换渲染结果，不再报错。三态截图见 `docs/screenshots/query-three-states.png`。

---

## 检查点 ③ 依赖数组：useEffect 依赖写全没？有没有闭包旧值？

**问题代码原文**：

```jsx
useEffect(() => {
  localStorage.setItem('posts', JSON.stringify(posts));
}, [currentCategory]);   // ← 用了 posts，却只依赖 currentCategory
```

```jsx
posts.push(post);        // ← 原地改数组，引用没变
setPosts(posts);         // setPosts 收到的是同一个引用，不触发重渲染
```

**违反**：官方 <https://zh-hans.react.dev/learn/synchronizing-with-effects> 要求 effect 里读取的每个响应式值都要写进依赖数组；<https://zh-hans.react.dev/learn/updating-arrays-in-state> 要求用新数组替换，而不是 `push` / `splice`。

**修改前后对比**：

```diff
- useEffect(() => {
-   localStorage.setItem('posts', JSON.stringify(posts));
- }, [currentCategory]);
+ // 用 Zustand persist 中间件接管持久化，值一变就写，不存在漏依赖
+ const usePostStore = create(persist((set) => ({ … }), {
+   name: 'posts',
+   partialize: (s) => ({ posts: s.posts })
+ }));
```

```diff
- posts.push(post);
- setPosts(posts);
+ publish: (post) => set((s) => ({ posts: [{ ...post, id: crypto.randomUUID(), … }, ...s.posts] }))
+
- posts.splice(idx, 1);
- setPosts(posts);
+ remove: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) }))
```

**修改后运行时变化**：修改前发一篇文章，界面**不更新**（同一个数组引用），只有切换一次分类才「突然」出现，而且刷新后新文章还丢了（effect 没跑）;修改后发布瞬间列表顶部出现新文章，F5 刷新仍在（`localStorage` 里 `posts` 键已写入）。持久化前后对比见 `docs/screenshots/persist-before-after.png`。

---

## 检查点 ④ 状态最小化：有没有冗余 state？

**问题代码原文**：

```jsx
const [filteredPosts, setFilteredPosts] = useState([]);  // 可由 posts + currentCategory 算出
const [total, setTotal] = useState(0);                   // 就是 posts.length
const [loading, setLoading] = useState(false);           // 同步读取 localStorage，永远是瞬时值
```

**违反**：官方 <https://zh-hans.react.dev/learn/choosing-the-state-structure> 第一条「避免冗余 state」——能由已有 state 算出来的值不要再存一份，否则两个来源必然不同步。

**修改前后对比**：

```diff
- const [filteredPosts, setFilteredPosts] = useState([]);
- const [total, setTotal] = useState(0);
+ // 全部改成渲染时派生
+ const visiblePosts = category === '全部' ? posts : posts.filter((p) => p.category === category);
+ <Header total={posts.length} categories={categories.length - 1} />
```

**修改后运行时变化**：修改前发布文章要同时 `setPosts`、`setTotal`、`setFilteredPosts` 三处（漏一处界面就不一致，原版 `handleEdit` 就漏了 `setTotal`）；修改后只改 `posts` 一个来源，总数、分类数、过滤结果自动跟着变，不会再出现「显示 4 篇但列表有 5 条」。

---

## 检查点 ⑤ AI 代码是否附 AI 使用声明、审查留痕？

**问题代码原文**：AI 直接输出组件代码，没有声明、没有说明哪些部分可信、没有审查记录。

**违反**：课程《AI 使用规范》要求实验根目录有 AI 使用声明，且审查需留痕。

**整改**：

- 首节「AI 使用声明」：写明使用范围、本人完成部分（任务书 §七：本实验的 AI 使用声明即本文件）；
- 新增本文件 `ai-reviews.md`：五个检查点各含问题原文、违反的规则、diff、运行时变化；
- 原始 AI 代码留档在 `docs/ai-raw/`，可与最终版本逐处对照；
- 每处修改都在代码注释里写清「为什么这样写」，而不是「AI 说的」。

**结果**：五检查点全部闭环，缺一项按任务书扣分。

---

## 附：审查中额外发现并整改的两处

| # | 问题 | 修改 | 后果 |
| --- | --- | --- | --- |
| 6 | 列表 `key={i}`（数组下标） | `key={post.id}` | 删除中间一项后，下面所有卡片的「身份」前移，输入框/展开态会串位。训练4 里用可切换的 index / id 复现了这个现象，截图见 `docs/screenshots/key-index-vs-id.png` |
| 7 | `id: Date.now()`（数字） | `crypto.randomUUID()`（字符串） | 同一毫秒内连续发布两条会撞 id，删除时两条一起消失；项目里 post.id 统一按 string 约定 |

## 复审结论

整改后 `lab2-blog` 的 8 个源文件全部通过五检查点；构建（`npm run build`）无警告，运行时控制台无报错。审查不通过的代码一律不进 `src/`，`docs/ai-raw/` 只作对照存档。
