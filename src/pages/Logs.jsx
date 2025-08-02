import { useState, useEffect, useMemo } from 'react';
import LogViewer from '../components/LogViewer';
import { useWebSocket } from '../contexts/WebSocketContext';
import { FolderIcon } from '../icons/Svg';
import ScrollLayout from '../Layout/ScrollLayout';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqsy4rBBU90WjDb8BwWzBYa1RcpQdVLcyCzbAE6KN8BYQEzmDzRE9Ef479I1z2nAWeRg/exec";

export default function Logs() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { sendMessage, isConnected, logData, clearLogs } = useWebSocket();

  // Fetch folder data only once
  useEffect(() => {
    fetch(SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFolders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching Drive data:", err);
        setLoading(false);
      });
  }, []);

  const handleGetLogsClick = () => {
    if (isConnected) {
      console.log('Requesting log file...');
      clearLogs();
      sendMessage("sendlog");
    } else {
      console.log('WebSocket is not connected.');
    }
  };

  return (
    <ScrollLayout maxHeight="100%" className="max-w-6xl p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Logs</h1>
          <p className="text-lg text-slate-500">Request the latest logs from the device.</p>
        </div>
        <button
          onClick={handleGetLogsClick}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-400"
          disabled={!isConnected}
        >
          Get Today's Log
        </button>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
          ))
        ) : (
          folders.map((folder, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200"
              onClick={() => setSelectedFolder(folder)}
            >
              <FolderIcon />
              <span className="text-sm font-medium text-slate-800">{folder.folderName}</span>
            </div>
          ))
        )}
      </div>

      {/* Log Viewer */}
      <LogViewer logs={logData} className="max-h-[65vh] overflow-y-auto" />

      <div className="flex pt-6 gap-2">
        <button
          onClick={clearLogs}
          className=" bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-400"
          disabled={!logData}
        >
          Download Log File
        </button>
        <button
          onClick={clearLogs}
          className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-400"
          disabled={!logData}
        >
          Clear Log Display
        </button>
      </div>

      {/* Modal */}
      {selectedFolder && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-800"
              onClick={() => setSelectedFolder(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">{selectedFolder.folderName}</h2>
            {selectedFolder.files?.length > 0 ? (
              <ul className="list-none text-slate-700 space-y-1">
                {selectedFolder.files.map((file, i) => (
                  <li
                    key={i}
                    className="cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"
                    onClick={() => handleFileClick(file, selectedFolder.folderName)}
                  >
                    {file}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No files in this folder.</p>
            )}
          </div>
        </div>
      )}

      <LogFetcher
        folderName="2025-07"
        fileName="log_2025_07_31.txt"
        onContentLoaded={(data) => console.log("Log content loaded", data)}
      />
    </ScrollLayout>
  );
}

const LogFetcher = ({ folderName, fileName, onContentLoaded }) => {
  const [logContent, setLogContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scriptUrl = "https://script.google.com/macros/s/AKfycbyqsy4rBBU90WjDb8BwWzBYa1RcpQdVLcyCzbAE6KN8BYQE/exec";

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${scriptUrl}?folderName=${encodeURIComponent(folderName)}&fileName=${encodeURIComponent(fileName)}`;
        const response = await fetch(url);
        const text = await response.text();

        if (!response.ok || text.startsWith("File") || text.startsWith("Folder")) {
          console.log(response)
          throw new Error(text);
        }

        setLogContent(text);
        onContentLoaded?.(text); // optional callback if parent wants to use it
      } catch (err) {
        setError(err.message);
        setLogContent("");
      } finally {
        setLoading(false);
      }
    };

    if (folderName && fileName) {
      fetchLog();
    }
  }, [folderName, fileName]);

  if (!folderName || !fileName) return null;

  return (
    <div className="p-4 border rounded-xl bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-slate-700">
        {fileName} from {folderName}
      </h3>

      {loading && <p className="text-blue-500">Loading log...</p>}

      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <pre className="whitespace-pre-wrap bg-slate-100 p-3 rounded text-sm text-slate-800 max-h-96 overflow-auto">
          {logContent}
        </pre>
      )}
    </div>
  );
};


