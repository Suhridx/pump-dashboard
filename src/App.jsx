import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

import { WebSocketProvider } from './contexts/WebSocketContext'; // Import the provider
import Status from './pages/Status';

function App() {
  return (
    <WebSocketProvider> {/* Wrap the entire app with the provider */}
      <div className="grid h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden bg-[#F9F5F1] lg:block"><Sidebar /></div>
        <div className="flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/status" element={<Status />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>

      </div>
    </WebSocketProvider>
  );
}

export default App;