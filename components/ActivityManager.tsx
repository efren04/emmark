import React, { useState } from 'react';
import { Activity, ActivityStatus, ActivityType } from '../types';
import { Plus, Trash2, Calendar, DollarSign, User, FileText, Download, MoreVertical, Paperclip } from 'lucide-react';
import { Modal } from './ui/Modal';
import { fileToBase64 } from '../services/storage';

interface ActivityManagerProps {
  activities: Activity[];
  onAddActivity: (activity: Activity) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

const statusColors: Record<ActivityStatus, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
  'Finalizada': 'bg-green-100 text-green-800 border-green-200',
};

export const ActivityManager: React.FC<ActivityManagerProps> = ({ activities, onAddActivity, onUpdateActivity, onDeleteActivity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [inCharge, setInCharge] = useState('');
  const [type, setType] = useState<ActivityType>('Logística');
  const [status, setStatus] = useState<ActivityStatus>('Pendiente');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const openAddModal = () => {
    setName('');
    setDate('');
    setCost('');
    setInCharge('');
    setType('Logística');
    setStatus('Pendiente');
    setAttachmentFile(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (activity: Activity, newStatus: ActivityStatus) => {
    onUpdateActivity({ ...activity, status: newStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let attachment = undefined;
    if (attachmentFile) {
      // Simulating upload by converting to base64
      try {
        const base64 = await fileToBase64(attachmentFile);
        attachment = {
          name: attachmentFile.name,
          type: attachmentFile.type,
          data: base64
        };
      } catch (err) {
        alert("Error al procesar el archivo");
        return;
      }
    }

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name,
      date,
      cost: Number(cost),
      inCharge,
      type,
      status,
      attachment
    };

    onAddActivity(newActivity);
    setIsModalOpen(false);
  };

  const downloadAttachment = (activity: Activity) => {
    if (!activity.attachment) return;
    const link = document.createElement('a');
    link.href = activity.attachment.data;
    link.download = activity.attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Actividades del Evento</h2>
          <p className="text-gray-500 text-sm">Planificación, costos y seguimiento</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Plus size={18} />
          Nueva Actividad
        </button>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No hay actividades creadas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Actividad</th>
                  <th className="px-6 py-4">Detalles</th>
                  <th className="px-6 py-4">Encargado</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Archivo</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{activity.name}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{activity.date || 'Sin fecha'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>${activity.cost.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span>{activity.inCharge}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={activity.status}
                        onChange={(e) => handleStatusChange(activity, e.target.value as ActivityStatus)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${statusColors[activity.status]}`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Finalizada">Finalizada</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {activity.attachment ? (
                        <button 
                          onClick={() => downloadAttachment(activity)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          title={activity.attachment.name}
                        >
                          <FileText size={18} />
                          <span className="underline text-xs">Descargar</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteActivity(activity.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar Actividad"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nueva Actividad"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Actividad</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                required
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
              <input 
                required
                type="number" 
                min="0"
                value={cost}
                onChange={e => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Encargado</label>
             <input 
               required
               type="text" 
               value={inCharge}
               onChange={e => setInCharge(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as ActivityType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Logística">Logística</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Catering">Catering</option>
                <option value="Marketing">Marketing</option>
                <option value="Otro">Otro</option>
              </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
               <select 
                value={status} 
                onChange={e => setStatus(e.target.value as ActivityStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Finalizada">Finalizada</option>
              </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Adjunto</label>
             <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-6 h-6 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span></p>
                        <p className="text-xs text-gray-500">PDF, XLS, JPG, PNG (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("El archivo es demasiado grande (Max 5MB).");
                            return;
                          }
                          setAttachmentFile(file);
                        }
                      }}
                    />
                </label>
            </div>
            {attachmentFile && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                Seleccionado: {attachmentFile.name}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Guardar Actividad
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};