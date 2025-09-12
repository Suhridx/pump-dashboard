import React from 'react';
import { useMqtt } from '../contexts/MqttContext';

import ScrollLayout from '../Layout/ScrollLayout';
import { UpArrowIcon } from '../icons/Svg'; // Assuming the icon is in this path

// A simple, reusable button component for the update actions
const UpdateButton = ({ id, label, deviceName, description, handleUpdate }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div>
            <span>
                <h3 className="font-semibold inline-block text-slate-800 dark:text-slate-200">{label}</h3>
                <span className="text-xs ml-2 text-zinc-600 bg-slate-100 rounded-2xl px-2">{deviceName}</span>
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium
         text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
         focus:ring-offset-2 focus:ring-blue-500 transition-all"
            onClick={() => handleUpdate(id)}
        >
            <UpArrowIcon />
            Update
        </button>
    </div>
);


export default function Updates() {
    const { publishMessage } = useMqtt();

    function handleUpdate(id) {
        console.log(id);
        
        console.log(JSON.stringify({ key: id }));
        
        publishMessage(JSON.stringify({ key: id }));
    }

    return (
        <ScrollLayout maxHeight="100%" className="max-w-4xl p-4 sm:p-6 md:p-10">
            <div className="flex flex-col gap-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Updates</h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Manage and apply the latest software updates to your system components.
                    </p>
                </div>

                {/* Update Actions List */}
                <div className="flex flex-col gap-4">
                    <UpdateButton
                        handleUpdate={handleUpdate}
                        id={"updateServer"}
                        label="Update Server"
                        deviceName="ESP-12F"
                        description="Apply the latest patches and updates to the main server."
                    />
                    <UpdateButton
                        handleUpdate={handleUpdate}
                        id={"update"}
                        label="Update Pump Controller"
                        deviceName="ESP32"
                        description="Flash the newest firmware to the pump controller."
                    />
                    <UpdateButton
                        handleUpdate={handleUpdate}
                        id={"updateResController"}
                        label="Update Reservoir Sensor"
                        deviceName="ESP-12"
                        description="Update the firmware for the reservoir monitoring sensor."
                    />
                    <UpdateButton
                        handleUpdate={handleUpdate}
                        id={"updateTankController"}
                        label="Update Tank Sensor"
                        deviceName="ESP-12"
                        description="Update the firmware for the main tank monitoring sensor."
                    />
                </div>
            </div>
        </ScrollLayout>
    );
}
