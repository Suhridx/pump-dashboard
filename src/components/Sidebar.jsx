import { NavLink } from 'react-router-dom';
import { useMqtt } from '../contexts/MqttContext';
// I've added UpdateIcon here, assuming it exists in your icons file.
import { DashboardIcon, LogsIcon, SettingsIcon, StatusIcon, LogoutIcon, UpdateIcon } from '../icons/Svg';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ setSidebarOpen }) {
  const { isConnected, publishMessage } = useMqtt();
  const { user , logout } = useAuth()

  const handleUpdateClick = () => {
    publishMessage(JSON.stringify({ key: 'update' }));
  };

  const handleNavClick = () => {
    // Only auto-close on small screens
    if (window.innerWidth < 1024 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 rounded-lg bg-blue-500 px-3 py-2 text-white transition-all'
      : 'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-200';

  return (
    <div className="flex h-full max-h-screen flex-col gap-4">
      {/* App Logo */}
      <div className="flex items-center px-6 pt-6 mb-4 justify-between">
        <NavLink to="/" onClick={handleNavClick} className="flex items-center gap-3 font-bold text-slate-900">
          <div className="flex flex-col">
            <span className="text-xl">Smart Pump</span>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-slate-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </NavLink>
        <div className="w-10 h-10 hover:bg-blue-100 rounded-lg flex items-center justify-center">
          <img src="./settings.png" alt="icon" style={{ height: '25px' }} />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium gap-2">
          <NavLink to="/" onClick={handleNavClick} className={getNavLinkClass}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/status" onClick={handleNavClick} className={getNavLinkClass}>
            <StatusIcon />
            Status
          </NavLink>
          <NavLink to="/settings" onClick={handleNavClick} className={getNavLinkClass}>
            <SettingsIcon />
            Settings
          </NavLink>
          <NavLink to="/logs" onClick={handleNavClick} className={getNavLinkClass}>
            <LogsIcon />
            Logs
          </NavLink>
          {/* --- New NavLink for Updates Page --- */}
          <NavLink to="/updates" onClick={handleNavClick} className={getNavLinkClass}>
            <UpdateIcon />
            Updates
          </NavLink>
        </nav>
      </div>

      {/* --- START: Merged User & Logout Section --- */}
      <div className="mt-auto  p-4">
        {user && (
          <button
            onClick={logout}
            className="flex w-full items-center justify-between rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-200"
          >
            {/* Left side: Avatar and Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-200 text-sm font-bold text-blue-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">Welcome, {user.name}</span>
            </div>

            {/* Right side: Logout Icon */}
            <LogoutIcon />
          </button>
        )}
      </div>
      {/* --- END: Merged User & Logout Section --- */}
    </div>
  );
}
