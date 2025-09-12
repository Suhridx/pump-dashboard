import { useState, useEffect } from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { LockOpenIcon, LockClosedIcon } from '../icons/Svg';
import ScrollLayout from '../Layout/ScrollLayout'


const ToggleSwitchSkeleton = () => (
  <div className="flex items-center justify-between p-4">
    <div className="mr-4 flex-1">
      <div className="h-5 w-1/3 bg-slate-200 rounded-md mb-2"></div>
      <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
    </div>
    <div className="h-6 w-11 bg-slate-200 rounded-full"></div>
  </div>
);

const SliderInputSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-5 w-32 bg-slate-200 rounded-md mb-2"></div>
        <div className="h-3 w-48 bg-slate-200 rounded-md"></div>
      </div>
      <div className="h-6 w-12 bg-slate-200 rounded-md"></div>
    </div>
    <div className="h-2 w-full bg-slate-200 rounded-lg mt-3"></div>
  </div>
);

const SelectInputSkeleton = () => (
  <div className="flex items-center justify-between p-5">
    <div className="mr-4">
      <div className="h-5 w-24 bg-slate-200 rounded-md mb-2"></div>
      <div className="h-3 w-40 bg-slate-200 rounded-md"></div>
    </div>
    <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="max-w-4xl w-full p-4 sm:p-8 animate-pulse">
    <div className="h-10 w-1/3 bg-slate-200 rounded-md mb-2"></div>
    <div className="h-5 w-1/2 bg-slate-200 rounded-md mb-8"></div>
    
    <div className="h-8 w-1/4 bg-slate-200 rounded-md mt-8 mb-2"></div>
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="divide-y divide-slate-200">
        <ToggleSwitchSkeleton />
        <ToggleSwitchSkeleton />
        <ToggleSwitchSkeleton />
      </div>
    </div>

    <div className="h-8 w-1/4 bg-slate-200 rounded-md mt-8 mb-2"></div>
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="divide-y divide-slate-200">
        <SliderInputSkeleton />
        <SliderInputSkeleton />
        <SelectInputSkeleton />
      </div>
    </div>
  </div>
);

const ToggleSwitch = ({ label, description, isChecked, onChange }) => (
  <div 
    onClick={() => onChange(!isChecked)}
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
  >
    <div className="mr-4">
      <h4 className="font-semibold text-slate-800">{label}</h4>
      <p className="text-sm text-slate-500 max-w-md">{description}</p>
    </div>
    <div
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
        isChecked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  </div>
);

const SliderInput = ({ label, description, value, onChange, isDisabled, min = 0, max = 100 }) => (
    <div className={`p-4 ${isDisabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between">
            <div>
                <h4 className="font-semibold text-slate-800">{label}</h4>
                <p className="text-sm text-slate-500 max-w-md">{description}</p>
            </div>
            <span className="font-bold text-blue-600">{value}%</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            disabled={isDisabled}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none mt-2 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-stone-500
                        [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-stone-500
            `}
        />
    </div>
);

// /**
//  * A styled select/dropdown component for settings.
//  * @param {string} label - The label for the input.
//  * @param {string} description - A short description of the setting.
//  * @param {number | string} value - The current value of the select.
//  * @param {function} onChange - The function to call when the value changes.
//  * @param {Array<number>} options - The array of options for the dropdown.
//  * @param {boolean} isDisabled - Whether the select is disabled.
//  */
const SelectInput = ({ label, description, value, onChange, options, isDisabled = false }) => (
  <div
    className={`flex items-center justify-between p-5 ${
      isDisabled ? 'opacity-60' : ''
    }`}
  >
    <div className="mr-4">
      <h4 className="text-base font-semibold text-slate-800">{label}</h4>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          disabled={isDisabled}
          className={`appearance-none w-32 text-center bg-white border border-slate-300 rounded-lg p-2 pr-8 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-700 ${
            isDisabled ? 'cursor-not-allowed bg-slate-100' : 'cursor-pointer'
          }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-slate-400">
          ▼
        </div>
      </div>
      <span className="text-slate-600 font-medium">min</span>
    </div>
  </div>
);



export default function Settings() {
  const { settingsState, publishMessage } = useMqtt();
  const [localSettings, setLocalSettings] = useState(null);
  const [isThresholdLocked, setIsThresholdLocked] = useState(true);
  const timerOptions = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    if (settingsState) {
      setLocalSettings(settingsState);
    }
  }, [settingsState]);

  const handleSettingChange = (name, value) => {
    if (!localSettings) return;

    setLocalSettings(prev => ({ ...prev, [name]: value }));

    let payload;
    if (typeof value === 'boolean') {
        payload = { key: "settings", name: name };
    } else if (typeof value === 'number') {
        payload = { key: "settings", name: name, value: value };
    } else {
        console.error("Unsupported setting type:", typeof value);
        return;
    }
    publishMessage(JSON.stringify(payload));
  };
  
  if (!localSettings) {
    return <SettingsSkeleton/>;
  }

  return (
    
    <ScrollLayout maxHeight="100%" className="max-w-6xl p-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-lg text-slate-500 mb-8">Configure the device parameters.</p>
        
        <h2 className="text-2xl font-bold text-slate-700 mt-8 mb-2">General Controls</h2>
        <div className="rounded-lg border border-slate-200 bg-white">
            <div className="divide-y divide-slate-200">
                <ToggleSwitch 
                    label="Reservoir Level Control"
                    description="Turn Off Pump based on Reservoir water levels."
                    isChecked={localSettings.wl_ctrl}
                    onChange={(value) => handleSettingChange('wl_ctrl', value)}
                />
                <ToggleSwitch 
                    label="Overflow Control"
                    description="Enable or disable pump shut-off when the tank is full."
                    isChecked={localSettings.ovf_ctrl}
                    onChange={(value) => handleSettingChange('ovf_ctrl', value)}
                />
                 <ToggleSwitch 
                    label="Auto Power Cut Detection"
                    description="Automatically handle power outage scenarios."
                    isChecked={localSettings.apcd}
                    onChange={(value) => handleSettingChange('apcd', value)}
                />
                <ToggleSwitch 
                    label="Scheduled Turn On"
                    description="Allow the pump to be turned on by the scheduler."
                    isChecked={localSettings.sch_turn_on}
                    onChange={(value) => handleSettingChange('sch_turn_on', value)}
                />
                 <ToggleSwitch 
                    label="Lock Manual Control"
                    description="Prevent manual operation of the pump."
                    isChecked={localSettings.lck_man_ctrl}
                    onChange={(value) => handleSettingChange('lck_man_ctrl', value)}
                />
            </div>
        </div>

        <div className="flex items-center gap-4 mt-8 mb-2">
          <h2 className="text-2xl font-bold text-slate-700">Thresholds</h2>
          <button 
              onClick={() => setIsThresholdLocked(!isThresholdLocked)}
              className={`p-1 rounded-full ${isThresholdLocked ? 'text-red-500' : 'text-slate-500'} hover:bg-slate-100`}
          >
              {isThresholdLocked ? <LockClosedIcon /> : <LockOpenIcon />}
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white">
            <div className="divide-y divide-slate-200">
                <SliderInput
                    label="Reservoir Threshold"
                    description="Pump will not start if reservoir is below this level."
                    value={localSettings.res_thl}
                    onChange={(value) => handleSettingChange('res_thl', value)}
                    isDisabled={isThresholdLocked}
                />
                <SliderInput
                    label="Tank Overflow Threshold"
                    description="Pump will turn off if tank level exceeds this value."
                    value={localSettings.tank_thl}
                    onChange={(value) => handleSettingChange('tank_thl', value)}
                    isDisabled={isThresholdLocked}
                />
                <SelectInput
                    label="Default Timer"
                    description="Set the default runtime for the pump."
                    value={localSettings.default_timer}
                    onChange={(value) => handleSettingChange('default_timer', value)}
                    options={timerOptions}
                    isDisabled={isThresholdLocked}
                />
            </div>
        </div>
    </ScrollLayout>
  );
}
