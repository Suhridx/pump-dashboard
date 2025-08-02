const LogLine = ({ text, index }) => {
  const parseLine = (line) => {
  // Highlight timestamp
  line = line.replace(
    /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/g,
    (match) => `<span class="text-orange-400">${match}</span>`
  );

  // Command received
  line = line.replace(
    /Command received\s*:\s*\[[^\]]+\]/gi,
    (match) => `<span class="text-red-400 font-semibold">${match}</span>`
  );

  // status keyword
  line = line.replace(
    /\b(status)\b/gi,
    `<span class="text-blue-400 font-semibold">$1</span>`
  );

  // ON → green
  line = line.replace(
    /\bON\b/g,
    `<span class="text-green-400 font-bold">ON</span>`
  );

  // OFF → cyan
  line = line.replace(
    /\bOFF\b/g,
    `<span class="text-cyan-400 font-bold">OFF</span>`
  );

  // Highlight [Tank Level = ...%]
line = line.replace(
  /\[Tank Level = \d+%]/g,
  (match) =>
    `<span class="bg-lime-700 text-white font-mono text-sm px-2 py-0.5 rounded">${match}</span>`
);

// Highlight [Reservoir Level = ...%]
line = line.replace(
  /\[Reservoir Level = \d+%]/g,
  (match) =>
    `<span class="bg-stone-300 text-black font-mono text-sm px-2 py-0.5 rounded">${match}</span>`
);

  return line;
};


  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-slate-600 min-w-[2em] text-right select-none">{index + 1}</span>
      <span
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: parseLine(text) || "&nbsp;" }}
      />
    </div>
  );
};

export default function LogViewer({ logs, className = "" }) {
  if (!logs) return null;

  const logLines = logs.split("\n");

  return (
    <div
      className={`bg-[#1e1e2f] text-white font-mono text-sm rounded-lg shadow-inner border border-slate-700 overflow-hidden ${className}`}
    >
      <div className="max-h-[500px] overflow-y-auto p-4 pr-6 custom-scrollbar">
        <pre className="whitespace-pre-wrap">
          {logLines.map((line, index) => (
            <LogLine key={index} text={line} index={index} />
          ))}
        </pre>
      </div>
    </div>
  );
}
