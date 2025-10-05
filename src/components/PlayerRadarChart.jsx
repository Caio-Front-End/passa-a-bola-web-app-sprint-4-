// src/components/PlayerRadarChart.jsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// 'data' deve ser um array com um objeto, formatado para o gráfico
function PlayerRadarChart({ data }) {
  return (
    // ResponsiveContainer faz o gráfico se adaptar ao tamanho do container pai
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Seu Desempenho" dataKey="A" stroke="#863D86" fill="#863D86" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default PlayerRadarChart;