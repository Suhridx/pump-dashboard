import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Status from './pages/Status';
import Updates from './pages/Updates';
import { WebSocketProvider } from './contexts/WebSocketContext';

import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <WebSocketProvider>
      <div className="h-screen w-full flex flex-col lg:grid lg:grid-cols-[280px_1fr]">
        {/* Mobile Sidebar (Drawer Style) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute top-0 left-0 h-full w-64 bg-[#F9F5F1] shadow-md p-4"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <Sidebar setSidebarOpen ={setSidebarOpen}/>
            </div>
          </div>
        )}

        {/* Sidebar for large screens */}
        <div className="hidden bg-[#F9F5F1] lg:block">
          <Sidebar />
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Topbar with hamburger */}
          <div className="p-2 bg-white  flex items-center lg:hidden">
            <button onClick={() => setSidebarOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
          </div>

          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/status" element={<Status />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path='/updates' element={<Updates/>} />
            </Routes>
          </main>
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default App;
