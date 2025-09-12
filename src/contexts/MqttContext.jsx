import { createContext, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';

// 1. Create the context
const MqttContext = createContext(null);

// 2. Create a custom hook for easy access to the context
export const useMqtt = () => {
    return useContext(MqttContext);
};

// 3. Create the Provider component
export const MqttProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Your application-specific state
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
    const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
    
    // Cooldown logic state
    const [lastLogRequestTime, setLastLogRequestTime] = useState(null);
    const [lastLevelLogRequestTime, setLastLevelLogRequestTime] = useState(null);

    useEffect(() => {
        // --- Connection Logic ---
        const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;
        
        // Robust check for the broker URL
        if (!brokerUrl) {
            console.error("FATAL: VITE_MQTT_BROKER_URL is not defined in your .env file.");
            return;
        }
        if (!brokerUrl.startsWith('ws://') && !brokerUrl.startsWith('wss://')) {
            console.error(`FATAL: VITE_MQTT_BROKER_URL is missing a protocol (e.g., 'ws://' or 'wss://'). Current value: "${brokerUrl}"`);
            return;
        }

        const options = {
            username: import.meta.env.VITE_MQTT_USERNAME,
            password: import.meta.env.VITE_MQTT_PASSWORD,
            clientId: `mqtt_react_client_${Math.random().toString(16).slice(2, 10)}`, // Random client ID
        };

        const mqttClient = mqtt.connect(brokerUrl, options);
        setClient(mqttClient);

        // --- Event Handlers ---
        mqttClient.on('connect', () => {
            console.log('MQTT Client Connected');
            setIsConnected(true);

            // Define topics to subscribe to
            const topicsToSubscribe = [
                'device/status',   // For general status like pump, wireless, settings
                'device/logs',     // For log data streams
                'device/levels',   // For water level data streams
            ];
            
            mqttClient.subscribe(topicsToSubscribe, (err) => {
                if (!err) {
                    console.log('Successfully subscribed to topics:', topicsToSubscribe.join(', '));
                } else {
                    console.error('Subscription error:', err);
                }
            });
        });

        mqttClient.on('message', (topic, payload) => {
            const message = payload.toString();
            console.log(`Received message on topic "${topic}":`, message);
            setLastUpdatedAt(Date.now());

            try {
                const data = JSON.parse(message);

                // Your logic to handle different types of messages based on topic or content
                if ("log_status" in data) {
                    if (data.log_status === 'start') {
                        setLogData(''); // Clear previous logs on new request
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
                    }
                } else if ("level_data" in data) {
                    const parsed = JSON.parse(data.level_data.trim());
                    setLevelData(prev => [...prev, parsed]);
                } else {
                    // Handle general state updates
                    if ("wireless" in data) setWirelessState(data.wireless);
                    if ("pump" in data) setPumpState(data.pump);
                    if ("settings" in data) setSettingsState(data.settings);
                    if ("timer" in data) setTimerState(data.timer);
                    if ("schedule" in data) setScheduleState(data.schedule);
                    if ("routine" in data) setRoutineState(data.routine);
                }
            } catch (error) {
                console.error('Failed to parse incoming MQTT message JSON:', error);
            }
        });

        mqttClient.on('error', (err) => {
            console.error('MQTT Connection Error:', err);
            mqttClient.end();
        });

        mqttClient.on('close', () => {
            console.log('MQTT Client Disconnected');
            setIsConnected(false);
        });

        // Cleanup on component unmount
        return () => {
            if (mqttClient) {
                console.log('Closing MQTT connection...');
                mqttClient.end();
            }
        };
    }, []);

    const publishMessage = (message) => {
       let  topic='user/request'
        if (!client || !isConnected) {
            console.error('Cannot publish. MQTT client is not connected.');
            return;
        }

        // Optional: Cooldown logic for specific commands
        try {
            const parsed = JSON.parse(message);
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;

            if (parsed.key === "sendlog" && lastLogRequestTime && (now - lastLogRequestTime < fiveMinutes)) {
                console.warn("sendlog request ignored (cooldown not met)");
                return;
            }
            if(parsed.key === "sendlog") setLastLogRequestTime(now);
            
        } catch (e) { /* Not a JSON message with a key, proceed */ }

        console.log(`Publishing to topic "${topic}":`, message);
        client.publish(topic, message, (err) => {
            if (err) {
                console.error('Publish Error:', err);
            }
        });
    };

    const clearLogs = () => setLogData('Logs Cleared by user.');

    // The value provided to consuming components
    const value = {
        isConnected,
        publishMessage,
        // Your states and setters
        logData,
        logStatus,
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
        <MqttContext.Provider value={value}>
            {children}
        </MqttContext.Provider>
    );
};