import React, { useMemo } from 'react';
import Card from '../common/Card';
import TrendChart from '../charts/TrendChart';
import Heatmap from '../symptoms/Heatmap';
import ActivityIcon from '../icons/ActivityIcon';
import PillIcon from '../icons/PillIcon';
import { useData } from '../../contexts/DataContext';

const Dashboard: React.FC = () => {
    const { symptomLogs, pharmacies } = useData();
    
    const totalReportsToday = useMemo(() => {
        if (!symptomLogs) return 0;
        const today = new Date().setHours(0, 0, 0, 0);
        return symptomLogs.filter(r => new Date(r.timestamp).setHours(0,0,0,0) === today).length;
    }, [symptomLogs]);

    const symptomTrends = useMemo(() => {
        if (!symptomLogs) return [];
        const counts: { [key: string]: number } = {};
        symptomLogs.forEach(report => {
            // Assuming symptoms is a comma-separated string
            const symptomsList = report.symptoms.split(',').map(s => s.trim());
            symptomsList.forEach(symptom => {
                counts[symptom] = (counts[symptom] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [symptomLogs]);
    
    const heatmapData = useMemo(() => {
        if (!symptomLogs) return [];
        const districtCounts: { [key: string]: number } = {};
        symptomLogs.forEach(report => {
            const district = report.location?.district;
            if (district) {
                districtCounts[district] = (districtCounts[district] || 0) + 1;
            }
        });
        const allDistricts = [...new Set(symptomLogs.map(r => r.location?.district).filter(Boolean) as string[])];
        return allDistricts.map(district => ({ district, count: districtCounts[district] || 0 }));
    }, [symptomLogs]);

    const lowStockMedicines = useMemo(() => {
        if(!pharmacies) return [];
        const lowStock: { name: string; location: string; stock: number }[] = [];
        pharmacies.forEach(pharmacy => {
            pharmacy.inventory.forEach(item => {
                 // Assuming a capacity of 200 for calculation, since it's not in DB
                if ((item.quantity / 200) < 0.2) { 
                    const medicine = item.medicine;
                    if (medicine) {
                        lowStock.push({ name: medicine.name, location: pharmacy.name, stock: item.quantity });
                    }
                }
            });
        });
        return lowStock;
    }, [pharmacies]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Reports Today">
                    <div className="flex items-center space-x-4">
                        <ActivityIcon className="h-8 w-8 text-green-400" />
                        <p className="text-3xl font-bold">{totalReportsToday}</p>
                    </div>
                </Card>
                <Card title="Highest Symptom">
                     <div className="flex items-center space-x-4">
                        <p className="text-3xl font-bold capitalize">{symptomTrends[0]?.name || 'N/A'}</p>
                    </div>
                </Card>
                 <Card title="Low Stock Items">
                     <div className="flex items-center space-x-4">
                        <PillIcon className="h-8 w-8 text-yellow-400" />
                        <p className="text-3xl font-bold">{lowStockMedicines.length}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Symptom Trends" className="lg:col-span-2">
                    <TrendChart data={symptomTrends} />
                </Card>
                <Card title="Symptom Hotspots">
                    <Heatmap data={heatmapData} />
                </Card>
            </div>
            
             <Card title="Critical Medicine Stock">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-2">Medicine</th>
                                <th className="p-2">Pharmacy</th>
                                <th className="p-2">Stock Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockMedicines.slice(0, 5).map((item, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-2 font-medium">{item.name}</td>
                                    <td className="p-2 text-gray-400">{item.location}</td>
                                    <td className="p-2 text-red-400 font-bold">{item.stock} units</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default Dashboard;