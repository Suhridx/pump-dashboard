import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

const ScheduleStatusCardSkeleton = () => {
    const StatItemSkeleton = () => (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-300 rounded-lg animate-pulse"></div>
            <div className="flex-1 mt-1">
                <div className="h-3 w-3/4 bg-slate-300 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-300 rounded-md animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-200 rounded-3xl shadow-lg flex flex-col justify-between font-sans w-full mx-auto border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="h-6 w-3/5 bg-slate-300 rounded-md"></div>
                <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
                <StatItemSkeleton />
                <StatItemSkeleton />
                <StatItemSkeleton />
                <StatItemSkeleton />
            </div>
            <div className="animate-pulse">
                <div className="h-4 w-1/3 bg-slate-300 rounded-md mb-3"></div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-12 bg-slate-300 rounded-full"></div>
                    <div className="h-6 w-12 bg-slate-300 rounded-full"></div>
                    <div className="h-6 w-12 bg-slate-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};


const ScheduleStatusCard = () => {

    const { timerState, scheduleState } = useWebSocket();

    // Configuration for different modes, including their icons and descriptions.
    const modeConfig = {
        MANUAL: {
            icon: (
                // Using a span for the text-based icon.
                <span className="font-black text-2xl leading-none flex items-center justify-center h-full w-full">M</span>
            ),
            label: "MANUAL",
            description: "Turned On Manually",
        },
        AUTO: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "AUTO",
            description: "Running on a schedule",
        },
        REMOTE: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 9.393a15 15 0 0121.214 0" />
                </svg>
            ),
            label: "REMOTE",
            description: "Controlled wirelessly",
        },
        POWER: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            label: "POWER",
            description: "Running a Missed Schedule for Power Cut",
        }
    };

    const formatTime = (time) => {
        if (time === null || time === undefined) return "00:00";
        const hours = String(Math.floor(time / 100)).padStart(2, '0');
        const minutes = String(time % 100).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getCompletedSchedules = () => {
        const completedMask = scheduleState?.schedule_completed;
        const totalSchedules = timerState?.timer_arr.length;
        const completed = [];
        if (completedMask && totalSchedules) {
            for (let i = 1; i <= totalSchedules; i++) {
                if ((completedMask >> i) & 1) {
                    completed.push(i);
                }
            }
        }
        return completed;
    };

    const items = {
        "nextSchedule": formatTime(scheduleState?.next_schedule_time),
        "lastStart": formatTime(scheduleState?.last_start_time),
        "lastEnd": formatTime(scheduleState?.last_end_time),
        "lastMode": scheduleState?.last_mode,
        "scheduleHistory": getCompletedSchedules(),
    };

    // A helper component for each stat item to avoid repetition
    const StatItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm text-purple-500">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-600">{label}</p>
                <p className="text-lg font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );

    // Determine the current mode and get the corresponding icon
    const lastModeStr = items.lastMode ? items.lastMode.toUpperCase() : 'AUTO';
    const currentIcon = modeConfig[lastModeStr]?.icon || modeConfig.AUTO.icon;
    
    // Clone the icon to apply consistent styling (size and color)
    const styledModeIcon = React.cloneElement(currentIcon, {
        className: 'h-6 w-6' // Ensures all mode icons are the same size
    });


    if (!timerState || !scheduleState) { return <ScheduleStatusCardSkeleton /> }

    return (
        // Card container with a light gradient background, rounded corners, and shadow
        <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-200 rounded-3xl shadow-lg flex flex-col justify-between font-sans w-full mx-auto border border-slate-200 text-slate-800 max-w-[600px]">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-700">
                    Schedule Status
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
                <StatItem
                    label="Next Schedule"
                    value={items.nextSchedule || 'N/A'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                {/* === LAST MODE STAT ITEM WITH DYNAMIC ICON === */}
                <StatItem
                    label="Last Mode"
                    value={<span className="capitalize">{items.lastMode || 'N/A'}</span>}
                    icon={styledModeIcon}
                />
                <StatItem
                    label="Last Start"
                    value={items.lastStart || 'N/A'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatItem
                    label="Last End"
                    value={items.lastEnd || 'N/A'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            {/* Recent History Section */}
            <div>
                <p className="text-sm text-slate-600 mb-2">Schedule History</p>
                <div className="flex flex-wrap items-center gap-2">
                    {items.scheduleHistory.length > 0 ? (
                        items.scheduleHistory.map((item) => (
                            <span
                                key={item}
    className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-gray-100 text-slate-700 rounded-full border border-slate-500"
                            >
                                {/* === ICON UPDATED FROM DOT TO TICK === */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">None</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ScheduleStatusCard;
