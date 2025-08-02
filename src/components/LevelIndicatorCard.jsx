import React from 'react';
import LiquidGauge from 'react-liquid-gauge'; // Using the requested library
import { useWebSocket } from '../contexts/WebSocketContext';
import { color } from 'd3-color'; // react-liquid-gauge uses d3 for color manipulation
import { ReservoirIcon, TankIcon } from '../icons/Svg';



// A reusable Gauge component styled to match the user's request.
const Gauge = ({ value, label, fillColor, IconComponent }) => {
  const radius = 80;
  const startColor = fillColor;
  const endColor = color(fillColor).brighter(0.5).hex();

  return (
    <div className="flex flex-col items-center">

        <LiquidGauge
          style={{ margin: '0 auto' }}
          width={radius * 2}
          height={radius * 2}
          value={value}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={20}
          textRenderer={(props) => {
            const value = Math.round(props.value);
            const radius = Math.min(props.height / 2, props.width / 2);
            const textPixels = (props.textSize * radius) / 2;
            const valueStyle = {
              fontSize: textPixels,
            };
            const percentStyle = {
              fontSize: textPixels * 0.6,
            };

            return (
              <tspan>
                <tspan className="value" style={valueStyle}>
                  {value}
                </tspan>
                <tspan style={percentStyle}>{props.percent}</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={2} // Restored original wave amplitude
          gradient // Restored gradient
          gradientStops={[
            { key: '0%', style: { stopColor: endColor, stopOpacity: 1 }, offset: '0%' },
            { key: '50%', style: { stopColor: startColor, stopOpacity: 0.75 }, offset: '50%' },
            { key: '100%', style: { stopColor: color(startColor).darker(0.5).hex(), stopOpacity: 0.5 }, offset: '100%' }
          ]}
          circleStyle={{
            fill: fillColor, // Light background for the gauge (slate-50)
            stroke: fillColor, // Using the fill color for the border
            strokeWidth: 0,   // Thick border as requested
          }}
          waveStyle={{
            fill: startColor,
          }}
          textStyle={{
            fill: '#475569', // Dark text for readability on light background
          }}
          waveTextStyle={{
            fill: '#FFFFFF', // White text on top of the wave
          }}
        />

      <div className="flex items-center gap-2 mt-4">
        {IconComponent && <IconComponent className="w-5 h-5 text-slate-500" />}
        <p className="text-slate-600 text-md font-medium">{label}</p>
      </div>
    </div>
  );
};


// Main card component with light-mode styling
const LevelIndicatorCard = () => {
    const { wirelessState } = useWebSocket();
    const tankLevel = wirelessState?.tank_level || 0;
    const reservoirLevel = wirelessState?.res_level || 0;
    const tankHeight = wirelessState?.tank_height || 0;
    const resHeight = wirelessState?.res_height || 0;
    
    // State to manage the expanded view
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Function to toggle the expanded state
    const toggleExpansion = () => {
        setIsExpanded(prevState => !prevState);
    };

    return (
        <div 
            className={`p-6 bg-white rounded-2xl shadow-lg font-sans transition-all duration-300 ease-in-out cursor-pointer ${isExpanded ? 'lg:col-span-2' : ''}`}
            onClick={toggleExpansion}
        >
            <h3 className="font-semibold text-slate-500 mb-8 text-center uppercase">
                Water Levels
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-around items-center">
                {/* Tank Section */}
                <div className="flex items-center gap-6">
                    <Gauge value={tankLevel} label="Tank" fillColor="#0ea5e9" IconComponent={TankIcon} />
                    {isExpanded && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 w-40 h-full">
                            <h4 className="font-bold text-slate-600 mb-2 border-b pb-1">Details</h4>
                            <div className="space-y-2 text-sm mt-2">
                                <p><span className="font-semibold text-slate-500">Level:</span> {tankLevel}%</p>
                                <p><span className="font-semibold text-slate-500">Sensor Distance:</span> {tankHeight} cm</p>
                                <p><span className="font-semibold text-slate-500">Water Height:</span> {76-tankHeight} cm</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reservoir Section */}
                <div className="flex items-center gap-6">
                    <Gauge value={reservoirLevel} label="Reservoir" fillColor="#14b8a6" IconComponent={ReservoirIcon} />
                     {isExpanded && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 w-40 h-full">
                            <h4 className="font-bold text-slate-600 mb-2 border-b pb-1">Details</h4>
                            <div className="space-y-2 text-sm mt-2">
                                <p><span className="font-semibold text-slate-500">Level:</span> {reservoirLevel}%</p>
                                <p><span className="font-semibold text-slate-500">Sensor Distance:</span> {resHeight} cm</p>
                                <p><span className="font-semibold text-slate-500">Water Height:</span> {130-resHeight} cm</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LevelIndicatorCard