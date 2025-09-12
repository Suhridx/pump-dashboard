import React, { useState, useEffect } from 'react';
import LogViewer from '../components/LogViewer';
import { useMqtt } from '../contexts/MqttContext';
import Spinner from '../utilities/Spinner'

// 1. A simple spinner component using Tailwind CSS


const SystemLogViewer = () => {
  const { publishMessage, isConnected,logStatus, logData, clearLogs } = useMqtt();
  // 2. Local state to track if logs are being streamed
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=>{
    setTimeout(() => {
      handleGetLogsClick()
    }, 500);
    
  },[isConnected])

  // 3. Effect to detect the end of the log stream
  useEffect(() => {

    // When logData changes, check if it contains the end signal
    if (logData && logStatus === 'end') {
      setIsLoading(false); // Stop the spinner
    }
  }, [logData]); // This effect runs every time logData is updated

  const handleGetLogsClick = () => {
    if (isConnected) {
      console.log('Requesting log file...');
      // clearLogs();
      setIsLoading(true); // 4. Start the spinner
      // publishMessage(JSON.stringify({ key: "sendlog" }));
      // publishMessage("sendlog");
    } else {
      console.log('WebSocket is not connected.');
    }
  };

  // 7. Placeholder function for downloading the log content
  const handleDownload = () => {
    if (!logData) return;
    // Clean the end-of-stream signal from the logs before downloading
    const cleanLogData = logData.replace("{'log_status': 'end'}", "").trim();
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
      {/* 5. Title with conditional spinner */}
      <div className='flex items-center mt-8 gap-2'>
        <h2 className="text-2xl font-bold text-slate-700  mb-2 flex items-center gap-3">
          System Log</h2>
        {isLoading && <Spinner />}
      </div>


      <LogViewer logs={logData} className="max-h-[65vh] overflow-y-auto" />

      <div className="flex pt-6 gap-2">
        <button
          onClick={handleGetLogsClick}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={!isConnected || isLoading} // 6. Disable button while loading
        >
          {logData ? "Refresh Log" : "Get Logs"}
        </button>

        {logData && !isLoading && (
          <>
            <button
              onClick={handleDownload} // Corrected onClick handler
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
    </>
  );
};

export default SystemLogViewer;