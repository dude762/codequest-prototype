// CodeQuest: Fully Compatible UI with Visual Movement and Traps

import { useState } from "react";

const commandBlocks = ["move_forward", "sense_trap", "jump"];
const trapTiles = [2, 5];

export default function CodeQuestGame() {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [playerPos, setPlayerPos] = useState(0);
  const [log, setLog] = useState([]);
  const [goal, setGoal] = useState(6);
  const [codeInput, setCodeInput] = useState("");

  const addBlock = (cmd) => {
    setSelectedBlocks([...selectedBlocks, cmd]);
  };

  const clearBlocks = () => {
    setSelectedBlocks([]);
    setLog([]);
    setPlayerPos(0);
    setCodeInput("");
  };

  const runCode = async () => {
    let output = [];
    let position = 0;
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
      await new Promise((res) => setTimeout(res, 500));
      if (step === "move_forward") {
        if (trapTiles.includes(position + 1)) {
          output.push("💥 Trap hit at position " + (position + 1) + "! Game over.");
          setLog(output);
          return;
        }
        position++;
        output.push("Moved forward to position " + position);
      } else if (step === "sense_trap") {
        if (trapTiles.includes(position + 1)) {
          output.push("⚠️ Trap sensed ahead at position " + (position + 1));
        } else {
          output.push("No trap ahead at position " + (position + 1));
        }
      } else if (step === "jump") {
        position++;
        output.push("Jumped to position " + position);
      }
      setPlayerPos(position);
    }

    output.push(
      position === goal
        ? "🎉 Success! You reached the treasure."
        : "❌ Try again. You're at position " + position
    );
    setLog(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">🧱 CodeQuest: Adventure with Traps</h1>
        <p className="mb-4">Goal: Reach position {goal} by avoiding traps using blocks or manual code.</p>

        {/* Visual Map */}
        <div className="flex items-center space-x-2 mb-6 transition-all duration-300 ease-in-out">
          {[...Array(goal + 2).keys()].map((pos) => (
            <div
              key={pos}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-md transition-all duration-300 ease-in-out ${
                pos === playerPos
                  ? "bg-blue-600 scale-110"
                  : pos === goal
                  ? "bg-green-600"
                  : trapTiles.includes(pos)
                  ? "bg-red-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            >
              {pos}
            </div>
          ))}
        </div>

        {/* Block Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {commandBlocks.map((cmd, i) => (
            <button
              key={i}
              onClick={() => addBlock(cmd)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded shadow"
            >
              {cmd}
            </button>
          ))}
          <button
            onClick={clearBlocks}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
          >
            Clear
          </button>
        </div>

        {/* Visual Display of Code */}
        <div className="mb-4">
          <h2 className="font-semibold">Your Code (from blocks):</h2>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded">
            {selectedBlocks.map((cmd, i) => (
              <span key={i} className="bg-blue-200 px-2 py-1 rounded text-sm">{cmd}</span>
            ))}
          </div>
        </div>

        {/* Manual Code Editor */}
        <div className="mb-4">
          <h2 className="font-semibold">Or Write Your Code (JSON array):</h2>
          <textarea
            rows={3}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            placeholder='Example: ["move_forward", "jump"]'
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
