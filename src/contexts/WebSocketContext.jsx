import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [logData, setLogData] = useState('');
    const [logStatus, setLogStatus] = useState('empty');

    const [levelData, setLevelData] = useState([]);
    const [levelStatus, setLevelStatus] = useState('empty');
    const [wirelessState, setWirelessState] = useState(null);
    const [pumpState, setPumpState] = useState(null);
    const [settingsState, setSettingsState] = useState(null);
    const [timerState, setTimerState] = useState(null);
    const [scheduleState, setScheduleState] = useState(null);
    const [routineState, setRoutineState] = useState(null);

    // Track last request times
    const [lastLogRequestTime, setLastLogRequestTime] = useState(null);
    const [lastLevelLogRequestTime, setLastLevelLogRequestTime] = useState(null);

    // Public last update timestamp
    const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
        if (!wsUrl) {
            console.error("VITE_WEBSOCKET_URL is not defined in .env file");
            return;
        }

        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        newSocket.onmessage = (event) => {
            
            try {
                const data = JSON.parse(event.data);
                console.log('Received data:', data);

                setLastUpdatedAt(Date.now());

                if ("log_status" in data) {
                    if (data.log_status === 'start') {
                        setLogStatus("start");
                    } else if (data.log_status === 'end') {
                        setLogStatus("end");
                        setLogData(prev => prev + '\n\n--- End of Log File ---');
                    }
                } else if ("log_data" in data) {
                    setLogData(prev => prev + data.log_data + '\n');
                } else if ("level_status" in data) {
                    if (data.level_status === 'start') {
                        setLevelData([]); // Reset level data
                        setLevelStatus("start");
                    } else if (data.level_status === 'end') {
                        setLevelStatus("end");
                        // Optionally: do something at the end
                    }
                } else if ("level_data" in data) {
                    try {
                        const parsed = JSON.parse(data.level_data.trim());
                        setLevelData(prev => [...prev, parsed]);
                    } catch (err) {
                        console.error('Failed to parse level_data:', err);
                    }
                } else {
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

        newSocket.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const sendMessage = (message) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected.');
            return;
        }

        try {
            const parsed = JSON.parse(message);
            console.log(message);


            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;

            if (parsed.key === "sendlog") {
                if (lastLogRequestTime && now - lastLogRequestTime < fiveMinutes) {
                    console.warn("sendLog request ignored (cooldown not met)");
                    return;
                }
                setLastLogRequestTime(now);
            }

            if (parsed.key === "sendLevelLog") {
                if (lastLevelLogRequestTime && now - lastLevelLogRequestTime < fiveMinutes) {
                    console.warn("sendLevelLog request ignored (cooldown not met)");
                    return;
                }
                setLastLevelLogRequestTime(now);
            }

        } catch (e) {
            // message not JSON or doesn't have a key — proceed
        }

        socket.send(message);
    };

    const clearLogs = () => setLogData('Logs Cleared');

    const value = {
        isConnected,
        sendMessage,
        logStatus,
        logData,
        levelData,
        levelStatus,
        clearLogs,
        wirelessState,
        pumpState,
        settingsState,
        timerState,
        scheduleState,
        routineState,
        lastUpdatedAt,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
