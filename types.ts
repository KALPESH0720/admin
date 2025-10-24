

export enum View {
  Dashboard = 'Dashboard',
  SymptomTracker = 'Symptom Tracker',
  MedicineInventory = 'Medicine Inventory',
}

export interface SymptomLog {
  id: string;
  symptoms: string;
  disease: string;
  location: {
    district: string;
    // Assuming location jsonb contains district
  };
  timestamp: string;
}

export interface Pharmacy {
  id:string;
  name: string;
  address: string;
  inventory: Inventory[];
}

export interface Inventory {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  quantity: number;
  last_updated: string;
  medicine: Medicine;
}

export interface Medicine {
  id:string;
  name: string;
  description: string;
  category: string;
}

export interface PredictedDemand {
  medicineName: string;
  predictedDemandChange: string;
  reasoning: string;
}