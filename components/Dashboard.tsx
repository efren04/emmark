import React, { useMemo } from 'react';
import { Activity, Client } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, TrendingUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardProps {
  clients: Client[];
  activities: Activity[];
}

export const Dashboard: React.FC<DashboardProps> = ({ clients, activities }) => {
  
  const stats = useMemo(() => {
    const totalClients = clients.length;
    const confirmedClients = clients.filter(c => c.isConfirmed).length;
    const totalCost = activities.reduce((acc, curr) => acc + curr.cost, 0);
    const completedActivities = activities.filter(a => a.status === 'Finalizada').length;
    
    return {
      totalClients,
      confirmedClients,
      confirmationRate: totalClients ? Math.round((confirmedClients / totalClients) * 100) : 0,
      totalCost,
      totalActivities: activities.length,
      completedActivities,
      progress: activities.length ? Math.round((completedActivities / activities.length) * 100) : 0
    };
  }, [clients, activities]);

  const statusData = useMemo(() => {
    const counts = { Pendiente: 0, 'En Proceso': 0, Finalizada: 0 };
    activities.forEach(a => counts[a.status]++);
    return [
      { name: 'Pendiente', value: counts.Pendiente, color: '#FCD34D' }, // Yellow
      { name: 'En Proceso', value: counts['En Proceso'], color: '#60A5FA' }, // Blue
      { name: 'Finalizada', value: counts.Finalizada, color: '#34D399' }, // Green
    ];
  }, [activities]);

  const costData = useMemo(() => {
     // Group by type for cost analysis
     const map = new Map<string, number>();
     activities.forEach(a => {
        const val = map.get(a.type) || 0;
        map.set(a.type, val + a.cost);
     });
     return Array.from(map).map(([name, value]) => ({ name, value }));
  }, [activities]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const primaryColor = [79, 70, 229]; // Indigo 600

    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("EVENTO EMMARK", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Reporte de Proceso - ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 40, 180, 30, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total Clientes: ${stats.totalClients}`, 20, 50);
    doc.text(`Confirmados: ${stats.confirmedClients} (${stats.confirmationRate}%)`, 20, 60);
    doc.text(`Costo Total: $${stats.totalCost.toLocaleString()}`, 100, 50);
    doc.text(`Progreso Actividades: ${stats.progress}%`, 100, 60);

    // Clients Table
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Lista de Clientes", 14, 85);

    autoTable(doc, {
      startY: 90,
      head: [['Nombre', 'Sucursal', 'Teléfono', 'Estado']],
      body: clients.map(c => [
        c.name, 
        c.branch, 
        c.phone, 
        c.isConfirmed ? 'CONFIRMADO' : 'PENDIENTE'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Activities Table
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Detalle de Actividades", 14, finalY + 15);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Actividad', 'Fecha', 'Encargado', 'Tipo', 'Costo', 'Estado']],
      body: activities.map(a => [
        a.name,
        a.date,
        a.inCharge,
        a.type,
        `$${a.cost}`,
        a.status
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('evento-emmark-reporte.pdf');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Panel de Proceso</h2>
          <p className="text-gray-500 text-sm">Visión general del estado del evento</p>
        </div>
        <button 
          onClick={exportPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Clientes Confirmados</p>
            <p className="text-2xl font-bold text-gray-800">{stats.confirmedClients} <span className="text-sm font-normal text-gray-400">/ {stats.totalClients}</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Progreso Evento</p>
            <p className="text-2xl font-bold text-gray-800">{stats.progress}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Costo Total</p>
            <p className="text-2xl font-bold text-gray-800">${stats.totalCost.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Actividades Totales</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalActivities}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado de Actividades</h3>
          <div className="h-64 w-full">
            {activities.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No hay actividades registradas</div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-sm text-gray-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Costos por Tipo</h3>
          <div className="h-64 w-full">
            {activities.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(val) => `$${val}`} tick={{fontSize: 12}} />
                  <RechartsTooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">No hay costos registrados</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};