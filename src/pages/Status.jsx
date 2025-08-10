import { useState, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import ScrollLayout from '../Layout/ScrollLayout';
import ScheduleStatusCard from '../components/ScheduleStatusCard';
import ScheduleCard from '../components/ScheduleCard';

// Helper function to format time from 645 -> "06:45"
const formatTime = (time) => {
    if (time === null || time === undefined) return "00:00";
    const hours = String(Math.floor(time / 100)).padStart(2, '0');
    const minutes = String(time % 100).padStart(2, '0');
    return `${hours}:${minutes}`;
};

function convertTime(totalMinutes) {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const hrsText = hrs > 0 ? `${hrs}h` : "";
  const minsText = mins > 0 ? `${mins}min` : "";

  return `${hrsText} ${minsText}`.trim();
}

// Helper function to parse time from "06:45" -> 645
const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
};

// Component for the Edit Schedule Modal
const ScheduleEditModal = ({ schedule, isOpen, onClose, onSave }) => {
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (schedule) {
            setTime(formatTime(schedule.time));
            setDuration(schedule.duration);
            setIsEnabled(schedule.isEnabled);
        }
    }, [schedule]);

    if (!isOpen || !schedule) return null;

    const handleSave = () => {
        onSave({
            id: schedule.id,
            time: parseTime(time),
            duration,
            isEnabled,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Edit Schedule #{schedule.id}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Start Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Duration (minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Enable Schedule</span>
                        <button
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component for the Summary Status Items

// Component for the Timers Table
const TimeTable = ({ timerState, scheduleState, onEdit }) => {
    const schedules = timerState.timer_arr.map((time, index) => ({
        id: index + 1,
        time: time,
        duration: timerState?.duration_arr[index],
        isEnabled: timerState?.timer_enable_arr[index],
    }));

    return (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule #</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Start Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">End TIme</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration (min)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mode</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {schedules.map(schedule => {
                        const isCompleted = ((scheduleState.schedule_completed >> schedule.id) & 1) === 1;
                        return (
                            <tr key={schedule.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{schedule.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{formatTime(schedule.time)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{schedule.duration}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {schedule.isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex justify-center items-center">
                                        {isCompleted && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(schedule)} className="text-blue-600 hover:text-blue-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default function Status() {
    const { scheduleState, timerState, sendMessage } = useWebSocket();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const schedules = timerState?.timer_arr.map((time, index) => ({
        id: index + 1,
        time: time,
        duration: timerState?.duration_arr[index],
        isEnabled: timerState?.timer_enable_arr[index],
    }));

    const handleEditClick = (schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSchedule(null);
    };

    const handleSaveSchedule = (updatedSchedule) => {
        const payload = {
            key: 'timer_update',
            index: updatedSchedule.id - 1,
            time: updatedSchedule.time,
            duration: updatedSchedule.duration,
            enabled: updatedSchedule.isEnabled
        };
        sendMessage(JSON.stringify(payload));
        console.log('Sending update:', payload);
    };

    if (!timerState || !scheduleState) {
        return <div>Loading status...</div>;
    }

    return (
        <ScrollLayout maxHeight="100%" className="max-w-4xl p-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Device Status & Schedule</h1>
            <p className="text-lg text-slate-500 mb-8">View and manage the device's schedule.</p>

            <div>
                <h2 className="text-2xl font-bold text-slate-700 mt-8 mb-4">Configured Schedules</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedules.length > 0 &&
                        schedules.map((item) => (
                            <ScheduleCard
                                key={item.id}
                                name={`Schedule ${item.id}`}
                                time= {formatTime(item.time)}
                                ampm={item.time > 1200 ? "PM" : "AM"}
                                duration={convertTime(item.duration)}
                                active={item.isEnabled}
                                onEdit={handleEditClick}
                            />
                        ))}
                </div>
            </div>


            <h2 className="text-2xl font-bold text-slate-700 mt-8 mb-2">Schedule Summary</h2>
            <TimeTable timerState={timerState} scheduleState={scheduleState} onEdit={handleEditClick} />

            <ScheduleEditModal
                schedule={selectedSchedule}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSchedule}
            />
        </ScrollLayout>
    );
}
