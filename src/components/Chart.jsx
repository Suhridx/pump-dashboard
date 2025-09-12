import React, { useState, useEffect, useRef } from 'react';
import { useMqtt } from '../contexts/MqttContext';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Mock Data ---
// This data simulates the input you would receive from an API.
// const generateMockData = () => {
//   const data = [];
//   let currentTime = new Date('2023-10-26T00:00:00Z');
//   let tankLevel = 60;
//   let resLevel = 80;
//   let pumpState = false;

//   for (let i = 0; i < 72; i++) {
//     // Logic to turn pump on/off based on levels
//     if (tankLevel < 30 && resLevel > 10) {
//       pumpState = true; // Turn pump ON if tank is low and reservoir has water
//     } else if (tankLevel > 95) {
//       pumpState = false; // Turn pump OFF if tank is full
//     } else if (resLevel <= 5) {
//       pumpState = false; // Turn pump OFF if reservoir is nearly empty
//     }

//     // Adjust levels based on pump state and add some randomness
//     if (pumpState === 1) {
//       tankLevel += Math.random() * 4 + 4; // Tank fills faster
//       resLevel -= Math.random() * 3 + 2;  // Reservoir depletes
//     } else {
//       tankLevel -= Math.random() * 3 + 1; // Tank depletes from usage
//       resLevel += Math.random() * 1;      // Reservoir refills slowly
//     }

//     // Ensure levels stay within the 0-100 range
//     tankLevel = Math.max(0, Math.min(100, tankLevel));
//     resLevel = Math.max(0, Math.min(100, resLevel));

//     data.push({
//       timestamp: currentTime.toISOString(),
//       tank_level: parseFloat(tankLevel.toFixed(1)),
//       res_level: parseFloat(resLevel.toFixed(1)),
//       pump_state: pumpState,
//     });

//     // Increment time by 20 minutes for the next data point
//     currentTime = new Date(currentTime.getTime() + 20 * 60 * 1000);
//   }
//   return data;
// };

// const mockData = generateMockData();
// --- Helper Function to Format Timestamp ---
const formatXAxis = (tickItem) => {
  // Assuming tickItem is a string like '2023-10-26T10:00:00Z'
  const date = new Date(tickItem);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// --- Skeleton Loader Component ---
// This component displays a placeholder while the actual chart data is loading.
const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg w-full  mx-auto animate-pulse">
    {/* Title Skeleton */}
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>

    <div className="flex">
      {/* Y-Axis Skeleton */}
      <div className="w-12 flex flex-col justify-between items-end pr-2">
        <div className="h-4 bg-gray-200 rounded w-8 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-8 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </div>

      {/* Chart Area Skeleton */}
      <div className="w-full h-80 bg-gray-200 rounded-md relative overflow-hidden">
        {/* Faux grid lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="h-full w-px bg-gray-300 absolute" style={{ left: '20%' }}></div>
          <div className="h-full w-px bg-gray-300 absolute" style={{ left: '40%' }}></div>
          <div className="h-full w-px bg-gray-300 absolute" style={{ left: '60%' }}></div>
          <div className="h-full w-px bg-gray-300 absolute" style={{ left: '80%' }}></div>
          <div className="w-full h-px bg-gray-300 absolute" style={{ top: '25%' }}></div>
          <div className="w-full h-px bg-gray-300 absolute" style={{ top: '50%' }}></div>
          <div className="w-full h-px bg-gray-300 absolute" style={{ top: '75%' }}></div>
        </div>
      </div>
    </div>

    {/* X-Axis and Legend Skeleton */}
    <div className="flex justify-center items-center mt-4">
      <div className="h-6 w-20 bg-gray-200 rounded-md mx-2"></div>
      <div className="h-6 w-24 bg-gray-200 rounded-md mx-2"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-md mx-2"></div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-300">
      <p><strong>{format(new Date(label), 'dd/MM/yyyy, HH:mm:ss')}</strong></p>
      <p style={{ color: 'red' }}>
        Pump Status : {data.pump_state === 'ON' ? 'ON' : 'OFF'}
      </p>
      <p style={{ color: 'green' }}>Reservoir Level : {data.res_level}%</p>
      <p style={{ color: 'blue' }}>Tank Level : {data.tank_level}%</p>
    </div>
  );
};

// --- Main Chart Component ---
const WaterLevelChart = ({ data }) => {

  function preprocessPumpData(data) {
    return data.map((curr, i) => {
      const prev = data[i - 1];
      let pump_on = null;

      if (curr.pump_state) {
        pump_on = 100;
      } else if (prev && prev.pump_state === true && curr.pump_state === false) {
        // Keep the area ON for the first OFF point to ensure the step area renders correctly
        pump_on = 100;
      }

      return {
        ...curr,
        pump_on
      };
    });
  }

  function getEvenlySpacedTicks(data, intervalMinutes = 20) {
    if (!data || data.length === 0) return [];

    const getTime = ts => new Date(ts).getTime();
    const intervalMillis = intervalMinutes * 60 * 1000;

    const ticks = [];
    let nextTickTime = getTime(data[0].timestamp);

    for (let i = 0; i < data.length; i++) {
      const currentTime = getTime(data[i].timestamp);

      if (currentTime >= nextTickTime) {
        ticks.push(data[i].timestamp);
        // Set the next tick time based on the current data point's time, not the previous tick time
        nextTickTime = currentTime + intervalMillis;
      }
    }

    // Ensure last timestamp is included
    const last = data[data.length - 1].timestamp;
    if (!ticks.includes(last)) {
      ticks.push(last);
    }
    
    return ticks;
  }

  const chartData = preprocessPumpData(data);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl w-full mx-auto border border-gray-100">
      <div className="overflow-x-auto">
        {/* This container creates a responsive aspect ratio with a minimum height. */}
        <div className="relative w-[600px] md:w-full" style={{ paddingTop: '35%', minHeight: '400px' }}>
            {/* This div is positioned absolutely to fill the space created by the padding trick. */}
            <div className="absolute top-0 left-0 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            ticks={getEvenlySpacedTicks(chartData, 40)}
                            stroke="#6b7280"
                            padding={{ left: 20, right: 20 }}
                            tick={{ dy: 10 }}
                        />
                        <YAxis
                            label={{
                                value: 'Water Level (%)',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#374151',
                                dy: 40
                            }}
                            stroke="#6b7280"
                            domain={[0, 100]}
                            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload || !payload.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-300 opacity-75">
                                        <p className="font-bold">{new Date(label).toLocaleString()}</p>
                                        <p style={{ color: '#ff2056' }}>
                                            Pump Status: {data.pump_state === true ? 'ON' : 'OFF'}
                                        </p>
                                        <p style={{ color: '#009966' }}>Reservoir Level: {data.res_level}%</p>
                                        <p style={{ color: '#1E90FF' }}>Tank Level: {data.tank_level}%</p>
                                    </div>
                                );
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={50}
                            wrapperStyle={{ paddingBottom: '20px' }}
                            payload={[
                                { value: 'Tank Level', type: 'line', id: 'tank_level', color: '#1E90FF' },
                                { value: 'Reservoir Level', type: 'line', id: 'res_level', color: '#009966' },
                                { value: 'Pump ON', type: 'rect', id: 'pump_on', color: 'rgba(255, 32, 86, 0.4)' },
                            ]}
                        />

                        {/* Pump ON Area - New color */}
                        <defs>
                            <linearGradient id="pumpColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff2056" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ff2056" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="stepAfter"
                            dataKey="pump_on"
                            stroke="rgba(255, 32, 86, 0.5)"
                            fill="url(#pumpColor)"
                            strokeWidth={1}
                            name="Pump Status"
                            dot={false}
                        />

                        {/* Lines with thicker strokes and dots */}
                        <Line
                            type="monotone"
                            dataKey="tank_level"
                            name="Tank Level"
                            stroke="#1E90FF"
                            strokeWidth={3}
                            dot={{ r: 3, fill: '#1E90FF' }}
                            activeDot={{ r: 7 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="res_level"
                            name="Reservoir Level"
                            stroke="#009966"
                            strokeWidth={3}
                            dot={{ r: 3, fill: '#009966' }}
                            activeDot={{ r: 7 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- App Component ---
// This component simulates fetching data and handles the loading state.
export default function Chart() {
  const { publishMessage, isConnected, levelData, levelStatus } = useMqtt();
  const [isLoading, setIsLoading] = useState(true);

  // console.log("data from server: \n", levelData);


  useEffect(() => {

    if (levelStatus === 'end')
      setIsLoading(false)

  }, [levelStatus])


  const lastSentRef = useRef(null);

  useEffect(() => {
    // Simulate an API call to fetch data
    if (isConnected) {
      setTimeout(() => {
        publishMessage(JSON.stringify({ key: "sendLevelLog" }));
      }, 500);
      
    }

  }, [isConnected]); // The empty dependency array ensures this effect runs only once


  return (

    <div>
      {isLoading ? <ChartSkeleton /> : <WaterLevelChart data={levelData} />}
    </div>

  );
}
