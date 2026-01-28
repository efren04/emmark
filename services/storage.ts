import { Activity, Client } from '../types';

const CLIENTS_KEY = 'emmark_clients';
const ACTIVITIES_KEY = 'emmark_activities';

export const getClients = (): Client[] => {
  const data = localStorage.getItem(CLIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(ACTIVITIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveActivities = (activities: Activity[]) => {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
};

// Helper to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};