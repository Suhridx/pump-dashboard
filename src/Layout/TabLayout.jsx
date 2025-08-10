import { useState } from "react";


const TabLayout = ({ tabs }) => {
  // State to track the active tab, defaults to the first tab's title
  const [activeTab, setActiveTab] = useState(tabs[0]?.title);

  // Find the content of the currently active tab
  const activeContent = tabs.find(tab => tab.title === activeTab)?.content;

  return (
    <div>
      {/* --- Tab Navigation --- */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => setActiveTab(tab.title)}
              className={`whitespace-nowrap text-left py-2 px-1 border-b-2 font-medium text-lg transition-colors
                ${activeTab === tab.title
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <h2 className={`text-2xl font-bold  ${activeTab === tab.title
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}>{tab.title}</h2>
                          <p className="text-sm text-slate-500">{tab.subtitle}</p>
            </button>
            
          ))}
        </nav>
      </div>

      {/* --- Render Active Tab's Content --- */}
      <div>
        {activeContent}
      </div>
    </div>
  );
};

export default TabLayout;