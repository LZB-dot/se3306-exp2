# 实验二报告 · React 项目实战与 Zustand 状态管理

| 项目 | 内容 |
| --- | --- |
| 课程 | SE3306《现代 Web 前端框架与工程化》 |
| 实验 | 实验二 · React 项目实战与 Zustand 状态管理 |
| 姓名 / 学号 | 李泽滨 / 2024034743037 |
| 仓库 | <https://github.com/LZB-dot/se3306-exp2> |
| 部署 | <https://lzb-dot.github.io/se3306-exp2/>（push 后由 GitHub Actions 自动构建，入口页可跳转 `tic/` 与 `blog/`） |
| AI 使用声明 | [`ai-reviews.md`](./ai-reviews.md)（含 AI 使用声明 + 五检查点审查记录） |

---

## 一、实验目的

1. 掌握 React 项目从创建到部署的完整流程（对标官网 Quick Start / Thinking in React）；
2. 用实验验证 React 核心机制：JSX 编译、state 挂 Hook 链表、组件重跑、key 稳定唯一、自定义 Hook 复用；
3. 掌握客户端状态管理的三步演进：useState → useLocalStorage → Zustand，并理解客户端状态 vs 服务端状态的边界；
4. 形成「查官方文档 → 动手 → 验证 → 提交说明」的学习闭环，并用五检查点审查 AI 生成的代码。

## 二、实验环境与工具

| 类别 | 内容 |
| --- | --- |
| 硬件/系统 | 个人电脑，Windows 11 |
| 运行时 | Node.js 22（≥20），pnpm 可用（本机用 npm 等价命令完成） |
| 技术栈 | React 18.3 · Vite 6 · Zustand 5 · TanStack Query 5 · json-server 0.17 |
| 调试工具 | Chrome + React DevTools、Babel REPL（babeljs.io/repl）、浏览器控制台 |
| 编辑器 | VS Code |

## 三、实验原理（简述）

- **组件 = 函数**：首字母大写、props 只读、state 一变就重跑；JSX 编译为 `React.createElement` 调用。
- **Hooks 顺序即身份**：每个组件对应一条 Hook 链表，Hook 按声明顺序「排队领号」，这就是 Hook 规则的底层原因（见必答 1）。
- **状态管理三步演进**：
  1. `useState`：状态住在组件里；
  2. `useLocalStorage`（自定义 Hook）：给状态加持久化，刷新不丢；
  3. `Zustand`：升级为全局 store，跨组件共享 + `persist` 中间件自动写 localStorage。
- **客户端状态 vs 服务端状态**：界面 own 的数据用 useState/Zustand；来自服务器的数据在浏览器里只是缓存副本，由 TanStack Query 负责三态渲染、缓存失效与重新拉取。

各任务对应的官方章节（zh-hans.react.dev）在指导书 §3.1 已列全，写码过程中按需回查了 rules-of-hooks、rendering-lists、synchronizing-with-effects、reusing-logic-with-custom-hooks、choosing-the-state-structure 与 Zustand persist 两节。

## 四、实验内容与步骤

### 任务 1 · 井字棋（`lab2-tic/`）

跟着官网教程 tutorial-tic-tac-toe 手写。组件树：**Game → Board → Square**。

| 组件 | 职责 | 有无 state |
| --- | --- | --- |
| `Square` | 渲染一个格子，值与点击回调全部来自 props | 无（受控） |
| `Board` | 画九宫格、算胜负/平局、展示状态行 | 无（受控） |
| `Game` | 持有 `history`（每步棋盘快照）与 `currentMove`，负责时间旅行 | 全部 state 在这里 |

**自检三问：**

1. **Square 有 state 吗？** 没有。格子内容与点击都由父组件下发，Square 是纯受控组件——这正是后面状态提升的前提。
2. **winner 为什么提升到 Board/Game？** 胜负要由九个格子**共同**决定，任何一个 Square 都无法单独知道；而且 Game 还要按历史快照判定，所以判定逻辑放在持有全局快照的一层。
3. **为什么用 `[...squares]` 而不是直接改？** React 靠**引用变化**判断要不要重渲染；直接改数组引用不变，界面不更新。且 time-travel 需要「每一步都是不可变的快照」，原地改会把历史也改掉。

**时间旅行**：`history` 存每一步的 `squares` 快照，`jumpTo` 本质只是改「看第几步」这一个数字；回退后再落子则用 `history.slice(0, currentMove + 1)` 丢弃分叉再追加。

截图：`docs/screenshots/tic-01-board.png`（落子中）、`tic-02-win.png`（胜负判定）、`tic-03-timetravel.png`（回退到第 n 步）。

### 任务 2 · 基础训练营 6 练（`lab2-blog/src/exercises/`）

在博客项目里以「基础训练 1-6」页签呈现，每个训练对应一个组件，截图均见 `docs/screenshots/`：

| 训练 | 截图 | 一句话结论 |
| --- | --- | --- |
| 1 JSX 三件套 | `ex1-jsx.png` | JSX 里变量和表达式写在花括号里 |
| 2 ES6 七语法 | `ex2-es6.png` | 博客开发最常用的 ES6 语法是展开与 map |
| 3 useState 四连 | `ex3-state.png` | 数组要用新数组替换：React 靠引用变化判断重渲染，push 改的是同一个引用 |
| 4 列表与 key | `ex4-index-key.png` / `ex4-id-key.png` / `key-index-vs-id.png` | key 的作用是给 React 认节点；index 作 key 删除中间项会串位 |
| 5 useEffect | `ex5-effect.png` | 依赖数组告诉 React 什么时候重跑；effect 里的变量是那次渲染的快照 |
| 6 自定义 Hook | `ex6-hook.png` | 自定义 Hook 复用的是逻辑，不是界面 |

训练 4 有一个值得记录的细节：**受控输入复现不了串位**——每次渲染 React 都会把 value 强制同步回 DOM，坑被掩盖了。所以 `Ex4Key.jsx` 故意用非受控输入（文字存在 DOM 里），index 作 key 删除第一项后「甲-AAA/乙-BBB」整体前移的现象才肉眼可见；勾选 id 作 key 后现象消失。

训练 5 的闭包陷阱：`setTimeout` 里直接读 `count` 打印的是**点击那一刻的快照**（连点 3 次打印 3 个旧值），改用函数式更新 `setCount(c => …)` 拿到的才是最新值。

### 任务 3 · Thinking in React 四步法（`src/thinking/FilterableProductTable.jsx`）

照官网「可搜索的产品表」示例手写：

1. **拆组件**：FilterableProductTable → SearchBar + ProductTable → ProductCategoryRow + ProductRow；
2. **写静态版**：先用写死的 PRODUCTS 数据把界面画出来，不写任何 state；
3. **找最小 state**：只有 `filterText` 和 `inStockOnly` 会变；过滤后的列表能由二者 + products 算出，**不设 state**；
4. **定位置**：两个 state 都放在用到它们的共同最近父组件 FilterableProductTable，子组件只拿 props + 回调。

### 任务 4 · 手写博客 13 步（`lab2-blog/`）

按官网训练线 13 步走完，最终页面以「我的博客」页签呈现。对照关系：

| 步骤 | 官网章节 | 落地 |
| --- | --- | --- |
| 1 安装/快速开始 | installation | Vite 脚手架建 `lab2-blog`，理清 index.html → main.jsx → App.jsx |
| 2 第一个组件 | your-first-component | 按蓝图建 7 个组件骨架 |
| 3 JSX | writing-markup-with-jsx | 静态界面 + Babel REPL 对照（见下） |
| 4 props | passing-props-to-a-component | PostItem 全部数据来自 props，组件内无写死文章 |
| 5 条件渲染 | conditional-rendering | 空态「还没有文章，写下第一篇吧」、分类徽章、无摘要取正文前 60 字兜底 |
| 6 渲染列表 | rendering-lists | `key={post.id}`，无 key 警告 |
| 7 响应事件 | responding-to-events | 表单 `onSubmit` 阻止默认刷新；发布/删除/打开详情 |
| 8 State | state-a-components-memory | 五小步：最小计数器 → 受控输入 → 开关 → posts 进 state → 四字段受控表单 |
| 9 更新数组 | updating-arrays-in-state | 发布/删除/编辑全部 map / filter / 展开，无 push |
| 10 选择 state 结构 | choosing-the-state-structure | 文章总数、分类列表均由 posts 派生，无冗余 state |
| 11 共享状态 | sharing-state-between-components | `category`、`viewingId` 提升到 App，子组件 props + 回调 |
| 12 自定义 Hook | reusing-logic-with-custom-hooks | 手写 `useLocalStorage`（惰性读 + JSON 写入） |
| 13 构建与部署 | installation | `npm run build` → GitHub Pages（见 §五） |

**第 3 步 Babel REPL 对照结论**（把 `<div className="box"><h1>你好，{name}</h1></div>` 贴进 babeljs.io/repl）：

1. `className` 而不是 `class`：JSX 编译成 JS 对象后是属性名 `className`，`class` 是 JS 保留字；
2. 插值 `{name}` 变成对应变量/表达式的引用，作为 `children` 参数传入；
3. 标签变成 `React.createElement(标签名, props对象, ...children)` 的函数调用；
4. 反向验证 `<Div>`：大写开头被当作**组件**（引用一个变量），小写 `<div>` 被当作原生标签字符串——大写是组件的语法由此可证。

**组件树**（任务书要求的提交物，整改后版本）：见 `docs/screenshots/review-tree.png`。

**API 层设计**（任务书要求的接口预留）：

- `src/api/client.js`：统一请求封装。`BASE_URL` 为空即走 mock；接入真实后台只改这一个常量。mock 与真实后台都返回统一信封 `{ code, message, data }`，**两条分支都必须解出 `data` 再返回**，否则调用方拿到整个信封，`posts.map` 直接报错；
- `src/api/posts.js`：五个接口（列表/详情/发布/编辑/删除），路径与指导书表格一致；
- `src/api/mock.js`：4 篇示例文章 + 300ms 延迟模拟网络；
- 数据结构隐形约定：`post = { id: string, title, category, summary, content, publishedAt }`，前端不定义结构但严格依赖它；
- 层的定位：按任务书「接口预留」要求落地——现阶段博客页签的数据由 Zustand store 提供（客户端状态），远程页签按任务 5 示例直接 fetch json-server（服务端状态）；实验三接入真实后台时由这一层统一接管，组件代码与接口形状不变。

运行截图：`blog-00-empty.png`（空态）、`blog-01-list.png`（列表）、`blog-02-detail.png`（详情）、`blog-04-filter.png`（分类过滤）。

### 任务 5 · Zustand + TanStack Query

**1. Zustand 全局状态（`src/usePostStore.js`）**

- 任务 4 的 `useState + useLocalStorage` 整体迁移为 store：`posts / publish / update / remove`，`persist` 中间件自动读写 localStorage（键名 `posts`）；
- `partialize` 只持久化 `posts`，不把三个函数序列化进去；
- 组件用 **selector 精确订阅**：`usePostStore((s) => s.posts)` 逐字段取，避免任何字段变化把无关组件带崩；
- 自检：F5 刷新数据不丢（截图 `blog-03-persist.png`，运行日志 `cards after reload: 3`，localStorage 里 `posts` 键含 3 条记录）；各组件不再层层传 props，直接读 store。

**2. TanStack Query 服务端状态（`src/RemotePosts.jsx` + json-server）**

- `main.jsx` 用 `QueryClientProvider` 包住 App（不包直接报 `No QueryClient set`）；
- 本地 `json-server db.json --port 3000 --delay 500` 做真实后台，增删会写回 db.json；
- **三态**：`isPending`（延迟 500ms 期间肉眼可见）→ `isError`（停掉服务/改错端口）→ success 渲染列表。截图 `query-1-pending.png`、`query-3-error.png`、`query-2-success.png`，拼版 `query-three-states.png`；
- **乐观更新四步**：`onMutate` 取消旧查询 + 快照旧列表并先秒出 → `onError` 用快照回滚 → `onSettled` 重新拉取对齐。截图 `query-4-optimistic.png`（发布后新文章先出现）、`query-5-settled.png`（重拉后仍在，证明 json-server 真实落库）；
- **queryKey**：`['posts', port]`——端口是「制造失败」的开关，必须进 key 才会重新取；它是渲染间稳定的数据，不会造成重复请求或缓存串位。

**3. 边界总结（三问各举一例）**

| 问题 | 客户端状态举例 | 服务端状态举例 |
| --- | --- | --- |
| 数据所有者在哪？ | 表单草稿、当前分类——所有者在浏览器（Zustand store） | 远程文章列表——所有者在服务器，浏览器只是缓存副本 |
| 换设备/浏览器还在吗？ | `posts` 在 localStorage，换浏览器就没了（这正是「客户端」的含义） | 只要在服务器，换设备重新请求就有 |
| 别人改了要同步吗？ | 单机博客不用，自己的 store 自己改 | 要。所以 `onSettled` 必须 `invalidateQueries` 重拉对齐，否则界面停留在过期缓存 |

### 任务 6 · AI 审查（五检查点）

完整记录见根目录 [`ai-reviews.md`](./ai-reviews.md)：AI 自由生成的单文件组件存档于 `docs/ai-raw/BlogAllInOne.jsx`，按组件职责 / Hook 顺序 / 依赖数组 / 状态最小化 / AI 声明留痕五个检查点逐条整改，每条含**问题原文 → 违反的官方规则 → diff → 运行时变化**三件套；另附 2 处额外发现（index 作 key、`Date.now()` 作 id）。

## 五、项目提交与部署

- 仓库：`LZB-dot/se3306-exp2`，`main` 分支；
- 部署：`.github/workflows/deploy.yml` 在每次 push 到 main 时自动构建两个项目（`base` 分别注入 `/se3306-exp2/tic/` 与 `/se3306-exp2/blog/`），连同导航入口页一起发布到 **GitHub Pages**；
- 线上口径：Pages 无法运行 json-server，线上验收以入口页 + 两个静态应用能打开为准；三态与乐观更新在本地运行 `npm run mock` 后于「远程文章」页签查看（入口页已注明），符合任务书「验收以本地运行截图 + 部署主页能打开为准」的要求。

## 六、报告必答与选答

### 必答 1：为什么把 Hook 写在 if 里是必然出错，而不是偶尔出错？

React 给每个组件维护一条** Hook 链表**，`useState` 等 Hook 在每次渲染时按**调用顺序**排队领号：第 1 次渲染登记 1 号、2 号……第 N 号 Hook，之后每次渲染 React 都按同样的顺序把 state 对回号上。这套机制能工作的前提是：**两次渲染之间，Hook 的调用数量与顺序完全一致**。

把 Hook 写进 `if` 后，分支成立与否会让 Hook 的数量/顺序在两次渲染间发生变化。只要有一次变化，React 就无法把「这次的第 k 号 Hook」对回「上次的第 k 号 Hook」，后续所有 Hook 全部错位——报 `Rendered more hooks than during the previous render`（或把别的 Hook 的 state 接到当前 Hook 上）。它不依赖任何偶发条件：**两次渲染 Hook 数量不同就必然崩**，与数据长什么样无关。所以官方规则才写成硬约束：只在组件顶层调用 Hook，提前 return 必须放在所有 Hook 之后。

本项目里对应的整改实例（含 diff 与运行时对比）见 `ai-reviews.md` 检查点 ②；`RemotePosts.jsx` 现在的写法就是「所有 Hook 顶层调用、`if (isPending) return` 放在最后」。

### 必答 2：useState / useLocalStorage / Zustand 的选择思路 + 反例

**选择思路**按两个维度判断：状态被谁用、要不要活过刷新。

| 方案 | 适用场景 | 博客里的例子 |
| --- | --- | --- |
| `useState` | 只在单个组件内用、不需要活过卸载 | `PostForm` 的表单草稿 `draft`——离开表单就没有意义 |
| `useLocalStorage` | 主要还是单组件/父子少量共享，但要刷新不丢 | 迁移期（第 12 步）的 `posts` 持久化 |
| `Zustand` | 跨「大半个应用」共享、多处读写 | `posts`——Header 显示总数、PostList 渲染、PostForm 发布、PostDetail 编辑删除，四处读写在五个组件里 |

**该用 Zustand 却硬用 useState 的真实反例**：假设 `posts` 留在 `useState` 且放在 App——Header 要总数、PostForm 要发布、PostDetail 要删除，就得把 `posts`、`publish`、`update`、`remove` 一路以 props 钻透传下去（prop drilling）；一旦某层组件只透传不消费，重构时极易断链，而且每个中间组件都会因 `posts` 变化被迫重渲染。本项目整改前的 `BlogAllInOne.jsx` 就是这个形态的极端版：12 个 useState 挤在一个组件里，谁来改都要动同一个文件。迁移到 store 后，组件直接订阅需要的字段，props 链路从「五层」缩到「零层」。

### 选答 2：Zustand persist 与 useLocalStorage 都写 localStorage，为什么说 persist 是异步恢复？对首屏意味着什么？

`useLocalStorage` 的读发生在 `useState` 的惰性初始化函数里——**首次渲染时同步读**，第一帧拿到的就是恢复后的值。而 `persist` 中间件的恢复发生在 store 创建之后：`create` 先用初始值（空数组）建 store，再**异步**从 localStorage 读回并 `setState` 合并。于是存在一个窗口期：第一帧渲染的是空列表，恢复完成后才有数据。

对首屏意味着两件事：其一，可能出现「首屏闪空」——列表先空一下再填充（指导书 FAQ 里点的就是这个坑）；其二，**恢复完成前不要发起写入**，否则写入动作会以空状态为基础，把已有存档覆盖掉。本项目的页面首帧是「我的博客」页签列表，闪空窗口极短且空态文案本就存在，因此体验上可接受；若要严格处理，应订阅 persist 的 `onRehydrateStorage`，在恢复完成前禁用发布按钮。这也是本项目保留 `useLocalStorage.js` 作为教学对照的原因：它同步恢复，没有这个窗口期。

## 七、AI 使用规范

遵守课程 AI 使用规范：AI 只用于概念答疑、报错翻译与审查素材生成，全部功能代码本人手写与整改。按任务书 §七，本实验的 AI 使用声明即根目录 [`ai-reviews.md`](./ai-reviews.md)（首节为使用声明，其后为五检查点审查记录），AI 原始代码留档于 `docs/ai-raw/` 可逐处对照。

## 八、Debug 记录（对照 FAQ 的实际踩坑）

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 5173 端口被占 | 上一个 dev server 没关 | 博客项目改用 5174（`vite.config.js` 已固定） |
| 训练 4 复现不了串位 | 受控输入每次渲染强制回写 value，坑被掩盖 | 改成非受控输入，让文字留在 DOM 里，现象立刻可见 |
| `No QueryClient set` | 忘了包 Provider | `main.jsx` 用 `QueryClientProvider` 包住 App |
| error 态造不出来 | 服务一直正常 | 停掉 json-server 或勾选「端口改成 3999」复选框 |
| 乐观更新没回滚 | `onError` 忘了放回快照 | 严格按 onMutate/onError/onSettled 四步写，见 `RemotePosts.jsx` |
| persist 后首屏闪空 | 异步恢复窗口期 | 见选答 2；恢复完成前不触发写入 |
| 列表缺 key 警告 | map 里没写 key 或用 index | 全部 `key={post.id}` / `key={post.category}` 等稳定值 |

## 九、实验体会

这个实验把「会用 React」和「理解 React」分开了一半：井字棋时间旅行让「不可变快照」从口号变成手感——`slice` 一份再改，历史才能回放；训练 4 让 key 从「消警告的属性」变成「节点的身份证」，而且我学到了一个 FAQ 里没有的坑：受控输入会掩盖 index-key 串位，必须非受控才看得见。

状态三步演进是全实验最清晰的一条线。`useLocalStorage` 手写一遍之后再换成 Zustand，才明白 persist 中间件替我省掉的正是「惰性读 + JSON 读写 + 跨组件传递」这三件事；也才理解什么时候**不该**用全局 store——表单草稿放 store 里就是过度设计。TanStack Query 则划清了另一条边界：服务器数据的「真相」不在浏览器，浏览器里那份只是缓存，所以才有三态、失效与重拉，乐观更新本质是「先用缓存骗过眼睛，再用回调对齐真相」。

AI 审查任务给我的触动最大：不写任何要求的提示词生成的代码，功能上「能用」，但 12 个 useState 塞一个组件、条件分支里调 Hook、`push` 完直接 set 同一个引用——每一条都能跑，每一条都是定时炸弹。按五检查点逐条对照官方文档整改的过程，比照着范例写代码收获大得多，因为每处修改都要回答「违反了哪条规则、运行时会有什么不同」。

## 附：提交前自查清单

| # | 自查项 | 状态 |
| --- | --- | --- |
| 1 | Zustand store + persist，F5 刷新不丢 | ☑ `blog-03-persist.png` + localStorage dump |
| 2 | selector 精确订阅 | ☑ `App.jsx` 逐字段 `usePostStore((s) => …)` |
| 3 | Query 三态可复现 | ☑ `query-1/2/3-*.png` |
| 4 | queryKey 正确、无缓存串位 | ☑ `['posts', port]`，稳定值 |
| 5 | 乐观更新四步：秒出/回滚/重拉对齐 | ☑ `query-4/5-*.png`（含失败回滚开关） |
| 6 | ai-reviews 三件套齐全 | ☑ 五检查点 ×（原文/规则/diff/运行时变化） |
| 7 | 边界总结三问各举一例 | ☑ 任务 5 §3 |
