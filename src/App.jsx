// CodeQuest: 2D Grid Adventure with Random Traps

import { useState, useEffect } from "react";

const commandBlocks = ["move_up", "move_down", "move_left", "move_right", "sense_trap"];
const gridSize = 5;

export default function CodeQuestGame() {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [goal, setGoal] = useState([gridSize - 1, gridSize - 1]);
  const [trapTiles, setTrapTiles] = useState([]);
  const [log, setLog] = useState([]);
  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    const traps = [];
    while (traps.length < 5) {
      const pos = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ];
      if (
        !traps.some(([x, y]) => x === pos[0] && y === pos[1]) &&
        !(pos[0] === 0 && pos[1] === 0) &&
        !(pos[0] === goal[0] && pos[1] === goal[1])
      ) {
        traps.push(pos);
      }
    }
    setTrapTiles(traps);
  }, []);

  const addBlock = (cmd) => {
    setSelectedBlocks([...selectedBlocks, cmd]);
  };

  const clearBlocks = () => {
    setSelectedBlocks([]);
    setLog([]);
    setPlayerPos([0, 0]);
    setCodeInput("");
  };

  const isTrap = (pos) => trapTiles.some(([x, y]) => x === pos[0] && y === pos[1]);

  const runCode = async () => {
    let output = [];
    let position = [0, 0];
    let steps = selectedBlocks;

    if (codeInput.trim()) {
      try {
        const parsed = JSON.parse(codeInput);
        if (Array.isArray(parsed)) {
          steps = parsed;
        } else {
          output.push("❌ Code must be an array of commands.");
          setLog(output);
          return;
        }
      } catch (err) {
        output.push("❌ Invalid JSON format.");
        setLog(output);
        return;
      }
    }

    for (let step of steps) {
      await new Promise((res) => setTimeout(res, 400));

      let [x, y] = position;
      if (step === "move_up") x = Math.max(0, x - 1);
      else if (step === "move_down") x = Math.min(gridSize - 1, x + 1);
      else if (step === "move_left") y = Math.max(0, y - 1);
      else if (step === "move_right") y = Math.min(gridSize - 1, y + 1);
      else if (step === "sense_trap") {
        const directions = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];
        const nearby = directions.some(isTrap);
        output.push(nearby ? "⚠️ Trap nearby!" : "✅ No trap nearby.");
        continue;
      }

      position = [x, y];
      setPlayerPos([...position]);
      if (isTrap(position)) {
        output.push(`💥 Trap hit at (${x}, ${y})! Game over.`);
        setLog(output);
        return;
      }
      output.push(`Moved to (${x}, ${y})`);
    }

    const [gx, gy] = goal;
    output.push(
      position[0] === gx && position[1] === gy
        ? "🎉 Success! You reached the treasure."
        : `❌ Try again. You're at (${position[0]}, ${position[1]})`
    );
    setLog(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">🗺️ CodeQuest: 2D Trap Grid</h1>
        <p className="mb-4">Goal: Reach the bottom-right corner by avoiding traps.</p>

        <div className="grid grid-cols-5 gap-1 mb-6">
          {[...Array(gridSize)].map((_, x) =>
            [...Array(gridSize)].map((_, y) => {
              const isPlayer = playerPos[0] === x && playerPos[1] === y;
              const isGoal = goal[0] === x && goal[1] === y;
              const isTrapCell = isTrap([x, y]);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded shadow transition-all ${
                    isPlayer
                      ? "bg-blue-600 text-white"
                      : isGoal
                      ? "bg-green-500 text-white"
                      : isTrapCell
                      ? "bg-red-500 animate-pulse text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {isPlayer ? "🧙‍♂️" : isGoal ? "🏁" : ""}
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {commandBlocks.map((cmd, i) => (
            <button
              key={i}
              onClick={() => addBlock(cmd)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded shadow"
            >
              {cmd.replace("_", " ")}
            </button>
          ))}
          <button
            onClick={clearBlocks}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
          >
            Clear
          </button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Your Code (from blocks):</h2>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded">
            {selectedBlocks.map((cmd, i) => (
              <span key={i} className="bg-blue-200 px-2 py-1 rounded text-sm">{cmd}</span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Or Write Your Code (JSON array):</h2>
          <textarea
            rows={3}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            placeholder='Example: ["move_right", "move_down"]'
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>

        <button
          onClick={runCode}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mb-4"
        >
          Run Code
        </button>

        <div className="bg-gray-50 rounded-md p-4 shadow-inner">
          <h2 className="font-semibold mb-2">Console Output:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {log.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
