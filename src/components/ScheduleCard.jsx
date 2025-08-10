import React, { useState } from "react";



export default function ScheduleCard({ name, time, ampm, duration, active: defaultActive , onEdit}) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className={` cursor-pointer bg-gradient-to-r from-slate-100 ${active? 'to-lime-100' : 'to-zinc-200'} to-green-200 text-gray-800 rounded-2xl p-4 w-full max-w-xs shadow-sm text-sm sm:text-base`}
    onClick={onEdit}>
      {/* Schedule Name */}
      <div className="text-sm font-medium text-gray-600 mb-2">{name}</div>

      {/* Time and Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-end gap-1">
          <span className="text-3xl sm:text-4xl font-bold text-blue-600">{time}</span>
          <span className="text-sm pb-1 text-blue-500">{ampm}</span>
        </div>

        {/* Toggle */}
        <button
          
          className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${active ? "bg-emerald-500" : "bg-gray-400"
            }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${active ? "translate-x-4" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      {/* Duration Row - centered */}
      <div className="flex items-center gap-2 text-sm text-gray-800">
        {/* Hourglass Icon (centered inline) */}
        <svg xmlns="http://www.w3.org/2000/svg"
          height="24px" className=""
          viewBox="0 -960 960 960" width="24px" fill="#186df5" stroke="currentColor">
          <path d="m520-384 56-56-96-96v-184h-80v216l120 120ZM368-249q16-48 56.5-79.5T518-360h152q24-34 37-74.5t13-85.5q0-117-81.5-198.5T440-800q-117 0-198.5 81.5T160-520q0 98 58.5 172.5T368-249ZM520-40q-58 0-102-36.5T363-168q-122-26-202.5-124T80-520q0-150 105-255t255-105q150 0 255 105t105 255q0 43-9.5 83.5T763-360q66 0 111.5 47T920-200q0 66-47 113T760-40H520Zm-80-485Zm200 325Zm-120 80h240q33 0 56.5-23.5T840-200q0-33-23.5-56.5T760-280H520q-33 0-56.5 23.5T440-200q0 33 23.5 56.5T520-120Zm0-40q-17 0-28.5-11.5T480-200q0-17 11.5-28.5T520-240q17 0 28.5 11.5T560-200q0 17-11.5 28.5T520-160Zm120 0q-17 0-28.5-11.5T600-200q0-17 11.5-28.5T640-240q17 0 28.5 11.5T680-200q0 17-11.5 28.5T640-160Zm120 0q-17 0-28.5-11.5T720-200q0-17 11.5-28.5T760-240q17 0 28.5 11.5T800-200q0 17-11.5 28.5T760-160Z" />
        </svg>

        <span className="font-medium">{duration}</span>
      </div>
    </div>
  );
}
