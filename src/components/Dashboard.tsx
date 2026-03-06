'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Agent, generateAgents, randomizeAgents } from '@/data/agents';
import SidePanel from './SidePanel';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

const LOG_TEMPLATES = [
  (a: Agent) => `⚡ ${a.name} completed a task in ${a.departmentKr}`,
  (a: Agent) => `🔄 ${a.name} status → ${a.status}`,
  (a: Agent) => `📊 ${a.name}: ${a.lastAction}`,
  (a: Agent) => `✅ ${a.name} finished processing (${a.department})`,
  (a: Agent) => `🚀 ${a.name} started new assignment`,
];

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setAgents(generateAgents());
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = randomizeAgents(prev);
        // Generate log entry
        const randomAgent = updated[Math.floor(Math.random() * updated.length)];
        const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        const timestamp = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const entry = `[${timestamp}] ${template(randomAgent)}`;
        setActivityLog(prevLog => [entry, ...prevLog].slice(0, 50));

        // Update selected agent if it changed
        if (selectedAgent) {
          const updatedSelected = updated.find(a => a.id === selectedAgent.id);
          if (updatedSelected) setSelectedAgent(updatedSelected);
        }

        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedAgent]);

  const handleSelectAgent = useCallback((agent: Agent) => {
    setSelectedAgent(prev => prev?.id === agent.id ? null : agent);
  }, []);

  if (agents.length === 0) {
    return (
      <div className="h-screen w-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-cyan-400 text-xl animate-pulse">Initializing -y Group Network...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-[#0a0a1a] overflow-hidden">
      <div className="flex-1 relative">
        <Scene agents={agents} selectedAgent={selectedAgent} onSelectAgent={handleSelectAgent} />
        {/* Overlay title */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <h1 className="text-3xl font-bold text-white opacity-80">
            <span className="text-cyan-400">-y</span> Group
          </h1>
          <p className="text-sm text-gray-500">AI Agent Conglomerate Dashboard</p>
        </div>
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-[#0d0d20cc] backdrop-blur-sm rounded-lg p-3 border border-[#1a1a3a]">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs text-gray-400">Idle</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-gray-400">Offline</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-80 min-w-72 shrink-0">
        <SidePanel agents={agents} selectedAgent={selectedAgent} activityLog={activityLog} />
      </div>
    </div>
  );
}
