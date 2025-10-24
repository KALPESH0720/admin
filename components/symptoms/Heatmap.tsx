
import React from 'react';

interface HeatmapProps {
  data: { district: string; count: number }[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 0);
  
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-700';
    const intensity = Math.ceil((count / maxCount) * 8); // Scale from 1 to 8
    switch (intensity) {
      case 1: return 'bg-red-200';
      case 2: return 'bg-red-300';
      case 3: return 'bg-red-400';
      case 4: return 'bg-red-500';
      case 5: return 'bg-red-600';
      case 6: return 'bg-red-700';
      case 7: return 'bg-red-800';
      case 8: return 'bg-red-900';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-2 bg-gray-900 rounded-lg">
      {data.map(({ district, count }) => (
        <div key={district} className="relative group">
          <div className={`w-full h-24 rounded-md flex items-center justify-center ${getColor(count)}`}>
            <span className="text-white font-bold text-sm mix-blend-difference">{district}</span>
          </div>
          <div className="absolute bottom-full mb-2 w-full left-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg border border-gray-600">
              Reports: {count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
