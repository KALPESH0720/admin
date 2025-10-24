import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Heatmap from './Heatmap';
import { analyzeSymptomData } from '../../services/geminiService';
import { useData } from '../../contexts/DataContext';

const SymptomTracker: React.FC = () => {
  const { symptomLogs } = useData();
  const [query, setQuery] = useState('Identify unusual symptom clusters and their locations.');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const heatmapData = useMemo(() => {
    if(!symptomLogs) return [];
    const districtCounts: { [key: string]: number } = {};
    symptomLogs.forEach(report => {
        const district = report.location?.district;
        if(district) {
           districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
    });
    const allDistricts = [...new Set(symptomLogs.map(r => r.location?.district).filter(Boolean) as string[])];
    return allDistricts.map(district => ({ district, count: districtCounts[district] || 0 }));
  }, [symptomLogs]);

  const handleAnalysis = async () => {
    if (!query.trim() || !symptomLogs) return;
    setIsLoading(true);
    setAnalysis('');
    const result = await analyzeSymptomData(symptomLogs, query);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title="Symptom Distribution Heatmap">
        <p className="text-gray-400 mb-4 text-sm">Density of all symptom reports across districts.</p>
        <Heatmap data={heatmapData} />
      </Card>

      <div className="space-y-8">
        <Card title="AI-Powered Health Analysis">
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Ask a question about the symptom data to get insights from Gemini. For example: "Are there any correlations between fever and headache reports?"</p>
            <textarea
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Show me unusual symptom clusters..."
            />
            <button
              onClick={handleAnalysis}
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Analyze with Gemini'}
            </button>
          </div>
        </Card>

        { (isLoading || analysis) && (
          <Card title="Gemini Analysis Results">
            {isLoading && (
              <div className="flex justify-center items-center space-x-2 text-gray-400">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing data...</span>
              </div>
            )}
            {analysis && (
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                <p>{analysis}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;