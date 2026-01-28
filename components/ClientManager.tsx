import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Trash2, Edit2, Phone, Building, User, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './ui/Modal';

interface ClientManagerProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setBranch('');
    setPhone('');
    setIsConfirmed(false);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setBranch(client.branch);
    setPhone(client.phone);
    setIsConfirmed(client.isConfirmed);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const clientData: Client = {
      id: editingClient ? editingClient.id : crypto.randomUUID(),
      name,
      branch,
      phone,
      isConfirmed
    };

    if (editingClient) {
      onUpdateClient(clientData);
    } else {
      onAddClient(clientData);
    }
    setIsModalOpen(false);
  };

  const toggleConfirmation = (client: Client) => {
    onUpdateClient({ ...client, isConfirmed: !client.isConfirmed });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
          <p className="text-gray-500 text-sm">Administra la lista de invitados y confirmaciones</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* Responsive Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">No hay clientes registrados.</p>
          </div>
        )}
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${client.isConfirmed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 gap-1 mt-0.5">
                    <Building size={12} />
                    <span>{client.branch || 'Sin sucursal'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(client)} className="text-gray-400 hover:text-indigo-600 p-1">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDeleteClient(client.id)} className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{client.phone || 'N/A'}</span>
              </div>
              
              <button 
                onClick={() => toggleConfirmation(client)}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  client.isConfirmed 
                    ? 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {client.isConfirmed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {client.isConfirmed ? 'Confirmado' : 'No Confirmado'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal / Empresa</label>
            <input 
              type="text" 
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Ej. Centro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="+52..."
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="confirmCheck"
              checked={isConfirmed}
              onChange={e => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="confirmCheck" className="text-sm text-gray-700">Cliente confirmado</label>
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
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};