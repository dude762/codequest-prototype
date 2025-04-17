import { useState } from 'react'

const initialSteps = ["move_forward", "move_forward", "sense_trap", "jump", "move_forward"];

export default function App() {
  const [playerPos, setPlayerPos] = useState(0);
  const [log, setLog] = useState([]);

  const runCode = () => {
    let output = [];
    let position = 0;

    for (let step of initialSteps) {
      if (step === "move_forward") {
        position++;
        output.push("Moved forward to position " + position);
      } else if (step === "sense_trap") {
        output.push("Trap sensed ahead!");
      } else if (step === "jump") {
        position++;
        output.push("Jumped to position " + position);
      }
    }

    setPlayerPos(position);
    setLog(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">🧙‍♂️ CodeQuest: The Bugged Kingdom</h1>
        <p>Use basic code steps to help your hero navigate to the treasure!</p>
        <p><strong>Hero Position:</strong> {playerPos}</p>
        <button onClick={runCode} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow">
          Run Code
        </button>
        <div className="bg-gray-100 rounded-md p-4">
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
