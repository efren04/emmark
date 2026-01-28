import React, { useState, useEffect } from 'react';
import { Tab, Client, Activity } from './types';
import { getClients, saveClients, getActivities, saveActivities } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { ClientManager } from './components/ClientManager';
import { ActivityManager } from './components/ActivityManager';
import { LayoutDashboard, Users, CalendarDays, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Initial Load from "Backend" (LocalStorage)
  useEffect(() => {
    setClients(getClients());
    setActivities(getActivities());
  }, []);

  // Persistence Effects
  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // --- Handlers ---

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta actividad?")) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 sticky top-0 md:h-screen z-20 shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Hexagon size={24} className="text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">EVENTO EMMARK</h1>
            <p className="text-xs text-slate-400">Organizador v1.0</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab(Tab.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === Tab.DASHBOARD ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Proceso de Evento</span>
          </button>

          <button 
            onClick={() => setActiveTab(Tab.CLIENTS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === Tab.CLIENTS ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">Clientes</span>
          </button>

          <button 
            onClick={() => setActiveTab(Tab.ACTIVITIES)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === Tab.ACTIVITIES ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <CalendarDays size={20} />
            <span className="font-medium">Actividades</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <p className="text-xs text-slate-400 mb-2">Almacenamiento Local</p>
             <div className="w-full bg-slate-700 rounded-full h-1.5">
               <div className="bg-green-400 h-1.5 rounded-full w-3/4"></div>
             </div>
             <p className="text-[10px] text-slate-500 mt-2">Los datos se guardan en este dispositivo.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === Tab.DASHBOARD && (
            <Dashboard clients={clients} activities={activities} />
          )}
          {activeTab === Tab.CLIENTS && (
            <ClientManager 
              clients={clients} 
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          )}
          {activeTab === Tab.ACTIVITIES && (
            <ActivityManager 
              activities={activities}
              onAddActivity={handleAddActivity}
              onUpdateActivity={handleUpdateActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;