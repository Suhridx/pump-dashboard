import ScrollLayout from '../Layout/ScrollLayout';
import CloudLogViewer from '../components/CloudLogViewer';
import SystemLogViewer from '../components/SystemLogViewer';
import TabLayout from '../Layout/TabLayout'



export default function Logs() {

const logTabs = [
  {
      title: 'System Logs',
      content: <SystemLogViewer />,
      subtitle : 'View Logs from System'
    },
    {
      title: 'Cloud Logs',
      content: <CloudLogViewer />,
      subtitle : 'View Logs from Drive Logs'
    }
  ];



  return (
    <ScrollLayout maxHeight="100%" className="max-w-6xl p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Logs</h1>

        </div>

      </div>

      <TabLayout tabs={logTabs} />
      

    </ScrollLayout>
  );
}



