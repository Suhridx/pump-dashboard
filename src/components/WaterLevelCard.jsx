import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { LevelIcon } from '../icons/Svg';

// --- Skeleton Component (Unchanged) ---
const LevelCardSkeleton = () => (
  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-200 rounded-3xl shadow-lg w-full mx-auto border border-slate-200 text-slate-800">
    <div className="flex items-center justify-between mb-6 animate-pulse">
      <div className="h-6 w-3/5 bg-slate-300 rounded-md"></div>
      <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
    </div>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-pulse">
      <div className="w-28 h-28 bg-slate-300 rounded-full"></div>
      <div className="w-28 h-28 bg-slate-300 rounded-full"></div>
    </div>
  </div>
);


// --- CircularProgress Component (Unchanged) ---
const CircularProgress = ({ value, color, size }) => {
  if (size === 0) return null;
  const strokeWidth = 10;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle stroke="#e5e7eb" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          transition: 'stroke-dashoffset 0.5s ease',
          transform: `rotate(-90deg)`,
          transformOrigin: '50% 50%'
        }}
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize={size / 5} fontWeight="bold" fill="#1e293b">
        {`${Math.round(value)}%`}
      </text>
    </svg>
  );
};

// --- Responsive Wrapper Component (Unchanged) ---
const ResponsiveProgressWrapper = ({ value, color }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries && entries.length > 0) {
        const containerWidth = entries[0].contentRect.width;
        setSize(containerWidth);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      // A check to prevent errors if the ref is null during cleanup
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: 'auto' }}>
      <CircularProgress value={value} color={color} size={size} />
    </div>
  );
};

// --- ✨ NEW Info Icon Component ---
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- ✨ NEW Tooltip Component ---
const Tooltip = ({ children, content }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      {/* Tooltip appears below (top-full) and aligned to the left (left-0) of the icon */}
      <div className={`absolute w-max top-full left-0 mt-2
                            invisible opacity-0 group-hover:visible group-hover:opacity-100 
                            transition-opacity duration-300 z-10`}>
        {content}
      </div>
    </div>
  );
};


// --- ✅ UPDATED LevelStatusCard Component ---
const LevelStatusCard = () => {
  const { wirelessState } = useWebSocket();
  // Destructure all needed values, providing defaults
  const tankLevel = wirelessState?.tank_level ?? 0;
  const resLevel = wirelessState?.res_level ?? 0;
  const tankHeight = wirelessState?.tank_height ?? 0;
  const resHeight = wirelessState?.res_height ?? 0; // Assuming a reservoir height exists

  if (!wirelessState) return <LevelCardSkeleton />;

  // Define tooltip content as variables for clarity
  const tankTooltipContent = (
    <div className="p-3 bg-slate-800 text-white rounded-lg shadow-xl w-48">
      <h4 className="font-bold text-slate-100 mb-2 border-b border-slate-600 pb-1">Tank Details</h4>
      <div className="space-y-1 text-sm mt-2">
        <p><span className="font-semibold text-slate-300">Level:</span> {tankLevel}%</p>
        <p><span className="font-semibold text-slate-300">Sensor Distance:</span> {tankHeight} cm</p>
        <p><span className="font-semibold text-slate-300">Water Height:</span> {76 - tankHeight} cm</p>
      </div>
    </div>
  );

  const resTooltipContent = (
    <div className="p-3 bg-slate-800 text-white rounded-lg shadow-xl w-48">
      <h4 className="font-bold text-slate-100 mb-2 border-b border-slate-600 pb-1">Reservoir Details</h4>
      <div className="space-y-1 text-sm mt-2">
        <p><span className="font-semibold text-slate-300">Level:</span> {resLevel}%</p>
        <p><span className="font-semibold text-slate-300">Sensor Distance:</span> {resHeight} cm</p>
        <p><span className="font-semibold text-slate-300">Water Height:</span> {76 - resHeight} cm</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-white to-cyan-50 rounded-3xl shadow-lg flex flex-col justify-between font-sans w-full mx-auto border border-blue-100 text-slate-800 max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-700">Level Status</h3>
        <LevelIcon />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">

        <div className="flex flex-col items-center w-28 sm:w-32 md:w-36 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-slate-600">Tank Level</p>
            <Tooltip content={tankTooltipContent}>
              <InfoIcon />
            </Tooltip>
          </div>
          <ResponsiveProgressWrapper value={tankLevel} color="#1E90FF" />
          <p className="mt-2 text-sm text-slate-600">
            Tank is at <span className="font-bold">{tankLevel}%</span>
          </p>
        </div>

        <div className="flex flex-col items-center w-28 sm:w-32 md:w-36 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-slate-600">Reservoir Level</p>
            <Tooltip content={resTooltipContent}>
              <InfoIcon />
            </Tooltip>
          </div>
          <ResponsiveProgressWrapper value={resLevel} color="#009966" />
          <p className="mt-2 text-sm text-slate-600">
            Reservoir is at <span className="font-bold">{resLevel}%</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LevelStatusCard;
