// src/components/StatsDashboard.jsx
import React, { useMemo } from 'react';
import { 
  Trophy, 
  Goal, 
  HandHelping, 
  Target, 
  Star, 
  ShieldAlert,
  Percent 
} from 'lucide-react';

// Este componente recebe a lista de partidas e calcula os totais.
function StatsDashboard({ matches }) {
  // useMemo é ótimo aqui para evitar recalcular a cada renderização.
  const stats = useMemo(() => {
    const totalJogos = matches.length;
    
    return {
      // Estatísticas básicas
      totalJogos,
      vitorias: matches.filter(m => m.result === 'victory').length,
      empates: matches.filter(m => m.result === 'draw').length,
      derrotas: matches.filter(m => m.result === 'loss').length,
      
      // Estatísticas de ataque
      totalGols: matches.reduce((sum, m) => sum + m.goals, 0),
      totalAssists: matches.reduce((sum, m) => sum + m.assists, 0),
      
      // Estatísticas de disciplina
      yellowCards: matches.filter(m => m.yellowCard).length,
      redCards: matches.filter(m => m.redCard).length,
      
      // Conquistas
      mvps: matches.filter(m => m.mvp).length,
      mediaRating: totalJogos > 0 
        ? (matches.reduce((sum, m) => sum + m.rating, 0) / totalJogos).toFixed(1)
        : 0,
    };
  }, [matches]);

  // Calcula o aproveitamento
  const aproveitamento = useMemo(() => {
    if (stats.totalJogos === 0) return 0;
    return Math.round(
      ((stats.vitorias * 3 + stats.empates) / (stats.totalJogos * 3)) * 100
    );
  }, [stats]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-[var(--bg-color2)] p-4 rounded-lg border-1 border-gray-200/10 hover:bg-[var(--bg-color2-hover)] transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color || 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className={'text-gray-600'} size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Seção Principal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Aproveitamento"
          value={`${aproveitamento}%`}
          icon={Percent}
          color="text-white"
          subtitle={`${stats.vitorias}V ${stats.empates}E ${stats.derrotas}D`}
        />
        <StatCard
          title="Partidas"
          value={stats.totalJogos}
          icon={Trophy}
          subtitle="Total de jogos"
        />
        <StatCard
          title="MVPs"
          value={stats.mvps}
          icon={Star}
          color="text-white"
          subtitle={`${((stats.mvps / stats.totalJogos) * 100 || 0).toFixed(0)}% das partidas`}
        />
        <StatCard
          title="Média de Rating"
          value={stats.mediaRating}
          icon={Star}
          color="text-white"
          subtitle=" * de 5 estrelas"
        />
      </div>

      {/* Seção de Ataque */}
      <div>
        <h3 className="text-white font-semibold mb-3">Estatísticas de Ataque</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <StatCard
            title="Gols"
            value={stats.totalGols}
            icon={Goal}
            subtitle={`${(stats.totalGols / stats.totalJogos || 0).toFixed(1)} por jogo`}
          />
          <StatCard
            title="Assistências"
            value={stats.totalAssists}
            icon={HandHelping}
            subtitle={`${(stats.totalAssists / stats.totalJogos || 0).toFixed(1)} por jogo`}
          />
        </div>
      </div>

      {/* Seção de Disciplina */}
      <div>
        <h3 className="text-white font-semibold mb-3">Disciplina</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Cartões Amarelos"
            value={stats.yellowCards}
            icon={ShieldAlert}
            color="text-yellow-500"
            subtitle={`${(stats.yellowCards / stats.totalJogos || 0).toFixed(1)} por jogo`}
          />
          <StatCard
            title="Cartões Vermelhos"
            value={stats.redCards}
            icon={ShieldAlert}
            color="text-red-500"
            subtitle={`${(stats.redCards / stats.totalJogos || 0).toFixed(1)} por jogo`}
          />
        </div>
      </div>
    </div>
  );
}

export default StatsDashboard;