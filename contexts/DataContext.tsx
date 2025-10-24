import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Pharmacy, SymptomLog, Inventory, Medicine } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

interface DataContextType {
    pharmacies: Pharmacy[];
    symptomLogs: SymptomLog[];
    loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        // 1. Fetch all required data concurrently. The 'medicines' table contains the inventory info.
        const [medicinesRes, pharmaciesRes, symptomsRes] = await Promise.all([
            supabase.from('medicines').select('*'),
            supabase.from('pharmacies').select('*'),
            supabase.from('symptom_logs').select('*').order('timestamp', { ascending: false }).limit(500),
        ]);
        
        // Error handling
        const errors = [medicinesRes.error, pharmaciesRes.error, symptomsRes.error].filter(Boolean);
        if (errors.length > 0) {
            console.error("Error fetching data.");
            errors.forEach(error => console.error(JSON.stringify(error, null, 2)));
            setLoading(false);
            return;
        }
        
        const medicinesData = medicinesRes.data || [];
        const pharmaciesData = pharmaciesRes.data || [];
        const symptomData = (symptomsRes.data || []) as SymptomLog[];

        // 2. Create lookup maps for efficient data processing
        const pharmaciesMapByName = new Map(pharmaciesData.map(p => [p.name, p]));

        // 3. Group medicines by pharmacy name from the denormalized 'pharmacy' column
        const medicinesByPharmacy = new Map<string, any[]>();
        medicinesData.forEach(med => {
            if (med.pharmacy) {
                if (!medicinesByPharmacy.has(med.pharmacy)) {
                    medicinesByPharmacy.set(med.pharmacy, []);
                }
                medicinesByPharmacy.get(med.pharmacy)!.push(med);
            }
        });
        
        // 4. Build the final structured data that the application components expect
        const finalPharmacies = Array.from(medicinesByPharmacy.entries()).map(([pharmacyName, meds]) => {
            const pharmacyDetails = pharmaciesMapByName.get(pharmacyName);
            
            const inventory: Inventory[] = meds.map(med => {
                const medicine: Medicine = {
                    id: med.id,
                    name: med.name,
                    description: med.description,
                    category: med.category
                };
                return {
                    id: med.id, // Using medicine id as a unique key for the inventory item
                    pharmacy_id: pharmacyDetails?.id || 'unknown',
                    medicine_id: med.id,
                    quantity: med.quantity,
                    last_updated: med.created_at, // Use created_at as a fallback for last_updated
                    medicine: medicine
                };
            });

            return {
                id: pharmacyDetails?.id || pharmacyName,
                name: pharmacyName,
                address: pharmacyDetails?.address || 'Address not available',
                inventory: inventory
            };
        });


        // 5. Set state
        setPharmacies(finalPharmacies as Pharmacy[]);
        setSymptomLogs(symptomData);
    }

    useEffect(() => {
        if (session) {
            setLoading(true);
            const loadData = async () => {
                await fetchData();
                setLoading(false);
            };
            loadData();
        } else {
            // Set loading to false if there's no session to prevent infinite loading state
            setLoading(false);
        }
    }, [session]);
    
    const value = { pharmacies, symptomLogs, loading };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};