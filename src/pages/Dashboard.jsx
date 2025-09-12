import { useState, useEffect } from 'react';
import { useMqtt } from '../contexts/MqttContext';
import PumpControlCard from '../components/PumpControlCard';
import WaterLevelCard from '../components/WaterLevelCard'
import ScrollLayout from '../Layout/ScrollLayout';
import ScheduleStatusCard from '../components/ScheduleStatusCard';
import Chart from '../components/Chart';

// Component for the Pump Power Switch


// Component for the Water Level Indicators


export default function Dashboard() {
  const { routineState, scheduleState, timerState, isConnected } = useMqtt();

  // Function to format the time from the server
  const formatSystemTime = () => {
    if (routineState?.timeNow) {
      const time = routineState.timeNow;
      const hours = String(Math.floor(time / 100)).padStart(2, '0');
      const minutes = String(time % 100).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '--:--';
  };

  return (
    <ScrollLayout maxHeight="100%" className="max-w-full p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-1">Dashboard</h1>
          <p className="text-lg text-slate-500">
            System Time: <span className="font-mono font-semibold">{formatSystemTime()}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm font-medium text-slate-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1600px]">
        <PumpControlCard />
        <WaterLevelCard/>
        <ScheduleStatusCard />
      </div>
      <div className='mt-10'>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">System Water Levels & Pump Status</h2>

      <Chart/>
      </div>

    </ScrollLayout>
  );
}