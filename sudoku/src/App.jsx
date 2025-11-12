import { useEffect, useState } from "react";

const SIZE = 9;

const createEmptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const isSafe = (grid, row, col, num) => {
  for (let x = 0; x < SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  for (let y = 0; y < SIZE; y++) {
    if (grid[y][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const solveGrid = (grid) => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const HowToPlay = () => (
  <div className="howto">
    <h2>Sudoku Nasıl Oynanır?</h2>

    <p>
      Sudoku, 9x9'luk bir kare üzerinde oynanan mantık tabanlı bir sayı bulmaca
      oyunudur. Amaç, <strong>her satırda</strong>, <strong>her sütunda</strong>{" "}
      ve
      <strong> her 3x3 kutuda</strong> 1’den 9’a kadar olan tüm sayıların
      <strong> tekrarsız</strong> olacak şekilde yerleştirilmesidir.
    </p>

    <h3>Temel Kurallar</h3>
    <ul>
      <li>Her satırda 1-9 arası sayılar 1’er kez yer almalıdır.</li>
      <li>Her sütunda 1-9 arası sayılar 1’er kez yer almalıdır.</li>
      <li>
        Her 3x3 bölgede 1-9 arası sayılar tekrar etmeyecek şekilde
        doldurulmalıdır.
      </li>
      <li>Başlangıçta verilen sayılar değiştirilemez.</li>
    </ul>

    <h3>Oynanış</h3>
    <ul>
      <li>Boş hücrelere uygun olduğunu düşündüğün sayıları yaz.</li>
      <li>Bir sayı kırmızı görünüyorsa yanlış demektir.</li>
      <li>“Kontrol Et” tuşuyla çözümü doğrulayabilirsin.</li>
      <li>Yeni bir oyun başlatmak için "Yeni Oyun" butonunu kullan.</li>
    </ul>

    <p className="tip"></p>
  </div>
);

const generateSolvedGrid = () => {
  const grid = createEmptyGrid();
  solveGrid(grid);
  return grid;
};

const cloneGrid = (grid) => grid.map((row) => [...row]);

const generatePuzzleFromSolved = (solvedGrid, difficulty) => {
  const puzzle = cloneGrid(solvedGrid);
  let removals;

  if (difficulty === "easy") {
    removals = 35;
  } else if (difficulty === "medium") {
    removals = 45;
  } else {
    removals = 55;
  }

  let removed = 0;
  while (removed < removals) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return puzzle;
};

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [status, setStatus] = useState("");
  const [showMistakes, setShowMistakes] = useState(false);

  const newGame = (diff = difficulty) => {
    const solved = generateSolvedGrid();
    const generatedPuzzle = generatePuzzleFromSolved(solved, diff);
    setSolution(solved);
    setPuzzle(generatedPuzzle);
    setUserGrid(generatedPuzzle.map((row) => [...row]));
    setStatus("");
    setShowMistakes(false);
  };

  useEffect(() => {
    newGame("easy");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (e) => {
    const diff = e.target.value;
    setDifficulty(diff);
    newGame(diff);
  };

  const handleCellChange = (row, col, value) => {
    if (puzzle[row][col] !== 0) return;

    const val = value.replace(/[^1-9]/g, "");
    const newGrid = userGrid.map((r) => [...r]);
    newGrid[row][col] = val === "" ? 0 : Number(val);
    setUserGrid(newGrid);
  };

  const checkWin = () => {
    setShowMistakes(true);

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (userGrid[r][c] === 0 || userGrid[r][c] !== solution[r][c]) {
          setStatus("Henüz bitmedi veya hatalı sayılar var.");
          return;
        }
      }
    }
    setStatus("🎉 Tebrikler! Sudoku'yu çözdün!");
  };

  const isWrongCell = (row, col) => {
    if (!showMistakes) return false;
    const val = userGrid[row]?.[col];
    if (!val) return false;
    return val !== solution[row][col];
  };

  return (
    <div className="app">
      <h1 className="title">Sudoku</h1>

      <div className="controls">
        <div className="difficulty-group">
          <label htmlFor="difficulty">Zorluk:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="easy">Kolay</option>
            <option value="medium">Orta</option>
            <option value="hard">Zor</option>
          </select>
        </div>

        <button className="btn" onClick={() => newGame()}>
          Yeni Oyun
        </button>
        <button className="btn secondary" onClick={checkWin}>
          Kontrol Et
        </button>
      </div>

      <div className="board-wrapper">
        <div className="board">
          {userGrid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isFixed = puzzle[rIdx][cIdx] !== 0;
              const classes = [
                "cell",
                isFixed ? "cell-fixed" : "cell-editable",
                isWrongCell(rIdx, cIdx) ? "cell-wrong" : "",
                (cIdx + 1) % 3 === 0 && cIdx !== SIZE - 1
                  ? "cell-block-right"
                  : "",
                (rIdx + 1) % 3 === 0 && rIdx !== SIZE - 1
                  ? "cell-block-bottom"
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <input
                  key={`${rIdx}-${cIdx}`}
                  className={classes}
                  value={cell === 0 ? "" : cell}
                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                  disabled={isFixed}
                  maxLength={1}
                  inputMode="numeric"
                />
              );
            })
          )}
        </div>
      </div>

      <p className="status">{status}</p>

      <HowToPlay />
    </div>
  );
}

export default App;
