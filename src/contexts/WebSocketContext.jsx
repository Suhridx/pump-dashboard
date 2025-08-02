import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // States for different parts of the data object
    const [logData, setLogData] = useState('');
    const [wirelessState, setWirelessState] = useState(null);
    const [pumpState, setPumpState] = useState(null);
    const [settingsState, setSettingsState] = useState(null);
    const [timerState, setTimerState] = useState(null);
    const [scheduleState, setScheduleState] = useState(null);
    const [routineState, setRoutineState] = useState(null);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
        if (!wsUrl) {
            console.error("VITE_WEBSOCKET_URL is not defined in .env file");
            return;
        }
        const newSocket = new WebSocket(wsUrl);
        newSocket.onopen = () => { console.log('WebSocket connected'); setIsConnected(true); };
        
        newSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received data:', data);

                // Handle log stream
                if ("log_status" in data) {
                    if (data.log_status === 'start') {
                        setLogData('Receiving log file...\n');
                    } else if (data.log_status === 'end') {
                        setLogData(prev => prev + '\n--- End of Log File ---');
                    }
                } else if ("log_data" in data) {
                    setLogData(prev => prev + data.log_data + '\n');
                } 
                // Handle structured data object
                else {
                    if ("wireless" in data) setWirelessState(data.wireless);
                    if ("pump" in data) setPumpState(data.pump);
                    if ("settings" in data) setSettingsState(data.settings);
                    if ("timer" in data) setTimerState(data.timer);
                    if ("schedule" in data) setScheduleState(data.schedule);
                    if ("routine" in data) setRoutineState(data.routine);
                }
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        newSocket.onclose = () => { console.log('WebSocket disconnected'); setIsConnected(false); };
        newSocket.onerror = (error) => { console.error('WebSocket error:', error); setIsConnected(false); };
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    const clearLogs = () => setLogData('Logs Cleared');

    const value = { 
        isConnected, 
        sendMessage, 
        logData, 
        clearLogs,
        wirelessState,
        pumpState,
        settingsState,
        timerState,
        scheduleState,
        routineState
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};