export interface Client {
  id: string;
  name: string;
  branch: string;
  phone: string;
  isConfirmed: boolean;
}

export type ActivityStatus = 'Pendiente' | 'En Proceso' | 'Finalizada';
export type ActivityType = 'Logística' | 'Entretenimiento' | 'Catering' | 'Marketing' | 'Otro';

export interface Attachment {
  name: string;
  type: string;
  data: string; // Base64 string
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  cost: number;
  inCharge: string;
  type: ActivityType;
  status: ActivityStatus;
  attachment?: Attachment | null;
}

export interface AppState {
  clients: Client[];
  activities: Activity[];
}

export enum Tab {
  DASHBOARD = 'dashboard',
  CLIENTS = 'clients',
  ACTIVITIES = 'activities',
}