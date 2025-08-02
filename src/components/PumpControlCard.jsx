import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

// A dedicated component to display the mode with its corresponding icon
const ModeDisplay = ({ mode, isPumpOn }) => {
    // If the pump is off, display the 'OFF' status
    if (!isPumpOn) {
        return (
            <div>
                <p className="font-bold text-xl text-slate-700 tracking-wider">OFF</p>
                <p className="text-sm text-slate-500">Pump is idle</p>
            </div>
        );
    }

    // Configuration for each mode, including icon, label, and description
    const modeConfig = {
        MANUAL: {
            icon: (
                <span className="font-black text-xl leading-none">M</span>
            ),
            label: "MANUAL",
            description: "Turned On Manually",
        },
        AUTO: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "AUTO",
            description: "Running on a schedule",
        },
        REMOTE: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 9.393a15 15 0 0121.214 0" />
                </svg>
            ),
            label: "REMOTE",
            description: "Controlled wirelessly",
        },
        POWER: {
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            label: "POWER",
            description: "Running a Missed Schedule for Power Cut",
        }
    };

    // Select the current mode's configuration. Convert mode to uppercase for case-insensitive matching.
    // Default to MANUAL if the mode is unrecognized.
    const currentMode = modeConfig[mode?.toUpperCase()] || modeConfig.MANUAL;

    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                {currentMode.icon}
            </div>
            <div>
                <p className="font-bold text-xl text-slate-700 tracking-wider">{currentMode.label}</p>
                <p className="text-sm text-slate-500">{currentMode.description}</p>
            </div>
        </div>
    );
};


const PumpControlCard = () => {
    // Using the original WebSocket context hook from the user's project
    const { pumpState, routineState, sendMessage } = useWebSocket();

    const isPumpOn = pumpState?.pump_state === true;
    // Get the time from the server, prioritizing routineState
    const serverTime = routineState?.time_remaining ?? pumpState?.time_remaining ?? 0;

    // Local state for the countdown to ensure smooth UI updates
    const [localTimeRemaining, setLocalTimeRemaining] = useState(serverTime);

    // Effect to sync the local timer with the server time whenever new data arrives
    useEffect(() => {
        setLocalTimeRemaining(serverTime);
    }, [serverTime]);

    // Effect to handle the local 1-second interval countdown for a smooth display
    useEffect(() => {
        // Don't run the timer if the pump is off
        if (!isPumpOn) {
            setLocalTimeRemaining(0); // Reset timer when pump is off
            return;
        }

        // Set up an interval to decrement the time every second
        const interval = setInterval(() => {
            setLocalTimeRemaining(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Clean up the interval when the component unmounts or the pump is turned off
        return () => clearInterval(interval);
    }, [isPumpOn]);


    const handleToggle = () => {
        sendMessage(JSON.stringify({ key: "pump", name: "pump_state" }));
    };

    // Helper function to format seconds into HH:MM:SS for the display
    const formatTime = (totalSeconds) => {
        if (totalSeconds < 0) totalSeconds = 0;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    };
    
    // The timer display now uses the local state for a smooth countdown
    const { hours, minutes, seconds } = formatTime(localTimeRemaining);

    return (
        // Main card with a light, modern theme. Removed min-width to allow grid control.
        <div className="p-6 bg-white rounded-3xl shadow-lg flex flex-col justify-between font-sans w-full mx-auto border border-slate-200">
            {/* Header: Title and Status Indicator */}
            <div className="flex justify-between w-full items-center">
                <h3 className="font-bold text-lg text-slate-500 tracking-wider">PUMP</h3>
                <div className="flex items-center gap-3">
                    {/* User's original settings icon */}
                    <img src="./settings.png" alt="settings" className="h-6 w-6 cursor-pointer opacity-70 hover:opacity-100 transition" />
                    {/* Live Status Indicator Dot */}
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isPumpOn ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </div>
            </div>

            {/* Main Content: Button and Timer. Added flex-wrap for responsiveness. */}
            <div className="flex flex-wrap flex-1 items-center justify-center gap-6 my-8 min-h-[8rem]">
                {/* The main power button */}
                <button 
                    onClick={handleToggle}
                    className="relative w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-in-out transform active:scale-95 focus:outline-none"
                >
                    {/* The animated glow effect, rendered only when the pump is on */}
                    {isPumpOn && (
                        <span className="absolute h-full w-full rounded-full bg-sky-400 animate-ping opacity-70"></span>
                    )}

                    {/* The visible button surface */}
                    <div className={`
                        relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300
                        ${isPumpOn
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40'
                            : 'bg-slate-200 text-slate-500 shadow-md border-4 border-slate-300'
                        }
                    `}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                        </svg>
                    </div>
                </button>

                {/* Timer display, shown only when the pump is on. Removed fixed width. */}
                {isPumpOn && (
                    <div className="flex items-center font-mono text-5xl text-slate-700 text-left select-none">
                        <span>{hours}</span>
                        <span className="mx-1 text-4xl text-slate-400 animate-pulse">:</span>
                        <span>{minutes}</span>
                        <span className="mx-1 text-4xl text-slate-400 animate-pulse">:</span>
                        <span className="text-3xl text-slate-500 w-12">{seconds}</span>
                    </div>
                )}
            </div>
            
            {/* Footer: Status Mode and Description */}
            <div className="h-12 text-left">
                <ModeDisplay mode={pumpState?.mode} isPumpOn={isPumpOn} />
            </div>
        </div>
    );
};

export default PumpControlCard;
