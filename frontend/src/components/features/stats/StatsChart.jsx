import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export function StatsChart({ type, data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 italic">
        No hay datos suficientes para generar el gráfico.
      </div>
    );
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-xl">
      {title && <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="fecha" stroke="#999" fontSize={10} />
              <YAxis stroke="#999" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}

          {type === 'pie' && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          )}

          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="fecha" stroke="#999" fontSize={10} />
              <YAxis stroke="#999" fontSize={10} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
