// src/components/CategoryFilter.jsx —— 分类过滤
// 当前分类是「提升上去的 state」，住在 App 里，这里只负责显示与回调（第 11 步）
export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="filter">
      {categories.map((c) => (
        <button
          key={c}
          className={'chip' + (c === active ? ' chip-active' : '')}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
