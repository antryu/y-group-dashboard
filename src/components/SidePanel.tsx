'use client';

import { Agent } from '@/data/agents';
import { useMemo } from 'react';

interface SidePanelProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  activityLog: string[];
}

function KPICard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#12122a] border border-[#2a2a5a] rounded-lg p-3">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'active' ? 'bg-green-400' : status === 'idle' ? 'bg-yellow-400' : 'bg-red-400';
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

export default function SidePanel({ agents, selectedAgent, activityLog }: SidePanelProps) {
  const stats = useMemo(() => {
    const active = agents.filter(a => a.status === 'active').length;
    const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
    const avgUptime = Math.round(agents.reduce((s, a) => s + a.uptime, 0) / agents.length);
    return { active, totalTasks, avgUptime };
  }, [agents]);

  return (
    <div className="h-full bg-[#0d0d20] border-l border-[#1a1a3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a3a]">
        <h1 className="text-xl font-bold text-white">
          <span className="text-cyan-400">_y</span> Holdings
        </h1>
        <p className="text-xs text-gray-500 mt-1">AI Agent Conglomerate • 29 Agents</p>
      </div>

      {/* KPI Cards */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <KPICard label="Active" value={stats.active} sub={`of ${agents.length} agents`} />
        <KPICard label="Tasks" value={stats.totalTasks.toLocaleString()} sub="completed" />
        <KPICard label="Uptime" value={`${stats.avgUptime}%`} sub="avg across fleet" />
        <KPICard label="Depts" value="10" sub="operating" />
      </div>

      {/* Selected Agent Detail */}
      {selectedAgent && (
        <div className="mx-4 mb-4 p-3 bg-[#12122a] border rounded-lg" style={{ borderColor: selectedAgent.color + '66' }}>
          {selectedAgent.image && (
            <div className="flex justify-center mb-3">
              <img src={selectedAgent.image} alt={selectedAgent.name} className="w-20 h-20 rounded-lg object-cover border border-[#2a2a5a]" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedAgent.color, boxShadow: `0 0 8px ${selectedAgent.color}` }} />
            <span className="text-white font-semibold">#{selectedAgent.number} {selectedAgent.name}</span>
            <StatusDot status={selectedAgent.status} />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="text-gray-300">{selectedAgent.departmentKr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={
                selectedAgent.status === 'active' ? 'text-green-400' :
                selectedAgent.status === 'idle' ? 'text-yellow-400' : 'text-red-400'
              }>{selectedAgent.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tasks Done</span>
              <span className="text-gray-300">{selectedAgent.tasksCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Uptime</span>
              <span className="text-gray-300">{selectedAgent.uptime}%</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#2a2a5a]">
              <span className="text-gray-500">Current Task</span>
              <p className="text-cyan-300 mt-1">{selectedAgent.lastAction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Activity Feed</h2>
        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
          {activityLog.map((log, i) => (
            <div key={i} className="text-xs text-gray-400 py-1 px-2 bg-[#12122a] rounded border border-[#1a1a3a]">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
