import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
    data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                    <YAxis tick={{ fill: '#A0AEC0' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1A202C',
                            borderColor: '#4A5568',
                            color: '#E2E8F0'
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Bar dataKey="count" fill="#16A34A" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;