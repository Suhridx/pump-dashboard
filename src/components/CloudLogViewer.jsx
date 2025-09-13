import React, { useState, useEffect } from 'react';
import ModalLayout from '../Layout/ModalLayout';
import LogViewer from './LogViewer';
import { FolderIcon } from '../icons/Svg';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqsy4rBBU90WjDb8BwWzBYa1RcpQdVLcyCzbAE6KN8BYQEzmDzRE9Ef479I1z2nAWeRg/exec";

// 1. Create a simple skeleton component for the LogViewer
const LogViewerSkeleton = () => (
    <>
        <div className="mb-4 rounded-lg animate-pulse h-2 max-h-[65vh]">
            <div className="h-4 bg-gray-400 rounded w-3/4 mb-3"></div>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg animate-pulse h-100 max-h-[65vh]">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
    </>

);


function CloudLogViewer() {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [loading, setLoading] = useState(true); // For initial folder fetch
    const [isFileLoading, setIsFileLoading] = useState(false); // 👈 2. New state for file fetching
    const [logText, setLogText] = useState({});

    useEffect(() => {
        const url = `${SCRIPT_URL}?key=all`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setFolders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching Drive data:", err);
                setLoading(false);
            });
    }, []);

    // 3. Update the fetch function to manage the new loading state
    const fetchFileContent = (folderName, fileName) => {
        // console.log(folderName , " " , fileName);
        
        setIsFileLoading(true); // Start loading
        setLogText({}); // Clear previous logs immediately

        const url = `${SCRIPT_URL}?key=${encodeURIComponent(folderName)}&filename=${encodeURIComponent(fileName)}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.text) {
                    setLogText(data);
                } else if (data.error) {
                    console.error("Server error:", data.error);
                    setLogText({ text: `Error: ${data.error}`, name: "Error" }); // Show error in viewer
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLogText({ text: `Failed to fetch file. See console for details.`, name: "Fetch Error" });
            })
            .finally(() => {
                setIsFileLoading(false); // Stop loading, regardless of outcome
            });
    };

    const closeModal = () => setSelectedFolder(null);

    const clearLogs = () => {
        setLogText({});
    }

    const handleDownload = () => {
        if (!logText) return;
        // Clean the end-of-stream signal from the logs before downloading
        const cleanLogData = logText.text.replace("{'log_status': 'end'}", "").trim();
        const blob = new Blob([cleanLogData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_log_${new Date().toISOString()}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <h2 className="text-lg font-bold text-slate-700 mt-8 mb-2">Directories</h2>
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

            {/* 4. Conditionally render title, skeleton, and LogViewer */}

            {/* Show title only when not loading and content is available */}
            {!isFileLoading && logText.name && <h2 className="text-2xl font-bold text-slate-700 mt-8 mb-1">{logText.name}</h2>}

            {isFileLoading ? (
                <LogViewerSkeleton />
            ) : (
                <LogViewer logs={logText.text} className="max-h-[65vh] overflow-y-auto" />
            )}

            <div className="flex pt-6 gap-2">
                {/* Show buttons only when not loading and content is available */}
                {!isFileLoading && logText.text && (
                    <>
                        <button
                            onClick={handleDownload}
                            className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Download Log File
                        </button>
                        <button
                            onClick={clearLogs}
                            className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Clear Log Display
                        </button>
                    </>
                )}
            </div>

            <ModalLayout isOpen={!!selectedFolder} onClose={closeModal}>
                {selectedFolder && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Log {selectedFolder.folderName}</h2>
                        {selectedFolder.files?.length > 0 ? (
                            <ul className="list-none text-slate-700 space-y-2">
                                {selectedFolder.files.map((file, i) => (
                                    <li
                                        key={i}
                                        className="cursor-pointer p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
                                        onClick={() => { closeModal(); fetchFileContent(selectedFolder.folderName, file) }}
                                    >
                                        📄 {file}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic">No files in this folder.</p>
                        )}
                    </div>
                )}
            </ModalLayout>
        </>
    );
}

export default CloudLogViewer;