import React, { useState } from 'react';
import Card from '../common/Card';
import { predictMedicineDemand } from '../../services/geminiService';
import { PredictedDemand } from '../../types';
import { useData } from '../../contexts/DataContext';

const MedicineInventory: React.FC = () => {
    const { pharmacies, symptomLogs } = useData();
    const [predictions, setPredictions] = useState<PredictedDemand[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePredictDemand = async () => {
        if(!symptomLogs || !pharmacies) return;
        setIsLoading(true);
        setError(null);
        setPredictions(null);
        const result = await predictMedicineDemand(symptomLogs, pharmacies);
        if (typeof result === 'string') {
            setError(result);
        } else {
            setPredictions(result);
        }
        setIsLoading(false);
    };

    const getStockColor = (stock: number) => {
        if (stock < 40) return 'text-red-400';
        if (stock < 100) return 'text-yellow-400';
        return 'text-green-400';
    };
    
    return (
        <div className="space-y-8">
            <Card title="Pharmacy Inventory Status">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-600">
                            <tr>
                                <th className="p-3">Medicine</th>
                                <th className="p-3">Pharmacy</th>
                                <th className="p-3">Stock Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pharmacies.flatMap(pharmacy =>
                                pharmacy.inventory.map(item => {
                                    const medicine = item.medicine;
                                    if (!medicine) return null;
                                    return (
                                        <tr key={`${pharmacy.id}-${item.medicine_id}`} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3 font-medium">{medicine.name}</td>
                                            <td className="p-3 text-gray-400">{pharmacy.name}</td>
                                            <td className={`p-3 font-bold ${getStockColor(item.quantity)}`}>
                                                {item.quantity} units
                                            </td>
                                        </tr>
                                    );

                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="AI Demand Prediction">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <p className="text-gray-400 mb-4 md:mb-0">
                        Use Gemini to predict medicine demand based on current symptom trends.
                    </p>
                    <button
                        onClick={handlePredictDemand}
                        disabled={isLoading}
                        className="w-full md:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Predicting...' : 'Predict Demand'}
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center space-x-2 text-gray-400 mt-6">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing data to forecast demand...</span>
                    </div>
                )}
                {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
                {predictions && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {predictions.map((pred, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-bold text-lg text-white">{pred.medicineName}</h4>
                                <p className="text-green-400 font-semibold">{pred.predictedDemandChange}</p>
                                <p className="text-gray-300 text-sm mt-2">{pred.reasoning}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MedicineInventory;