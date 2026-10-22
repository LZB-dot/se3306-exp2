import { useState } from 'react';

/**
 * 任务1 井字棋 —— 跟着官网教程 tutorial-tic-tac-toe 手写
 * 组件树：Game（持有 history） -> Board（画九宫格） -> Square（一个格子）
 */

// 单个格子：自己不存 state，值由父组件通过 props 传进来，点击也回调给父组件
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 棋盘：九宫格 + 胜负判定展示
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // 已有胜者或该格已有棋子，直接忽略点击
    if (calculateWinner(squares) || squares[i]) return;

    // 不可变更新：先复制一份新数组，再改新数组，绝不直接改 props 里的 squares
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares); // 结果交给父组件 Game 记录进 history
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  let status;
  if (winner) status = '获胜者：' + winner;
  else if (isDraw) status = '平局，势均力敌';
  else status = '下一步玩家：' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// 最顶层：所有 state 都提升到这一层，时间旅行才可能实现
export default function Game() {
  // history 保存每一步的棋盘快照，currentMove 表示当前看第几步
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // 回退后再落子：丢弃当前步之后的分叉，再追加新的一步
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // 时间旅行本质：只是改一下「看第几步」
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) description = '回到第 ' + move + ' 步';
    else description = '回到开局';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <h1>井字棋</h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 八种连成一条线的情况，命中即返回胜者
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
    [0, 4, 8], [2, 4, 6]             // 斜
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
