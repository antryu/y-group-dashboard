export type AgentStatus = 'active' | 'idle' | 'offline';

export interface Agent {
  id: string;
  name: string;
  department: string;
  departmentKr: string;
  color: string;
  status: AgentStatus;
  lastAction: string;
  tasksCompleted: number;
  uptime: number; // percentage
  position: [number, number, number];
}

export interface Department {
  name: string;
  nameKr: string;
  color: string;
  agents: string[];
  center: [number, number, number];
}

const ACTIONS = [
  'Analyzing quarterly report...',
  'Generating content draft...',
  'Reviewing pull request #342...',
  'Deploying staging build...',
  'Scanning for vulnerabilities...',
  'Optimizing ad campaign...',
  'Processing invoice batch...',
  'Running sentiment analysis...',
  'Updating knowledge base...',
  'Monitoring system health...',
  'Compiling financial model...',
  'Drafting social media post...',
  'Running A/B test analysis...',
  'Auditing compliance logs...',
  'Evaluating candidate profile...',
  'Executing trade strategy...',
  'Rendering design assets...',
  'Building CI/CD pipeline...',
  'Writing unit tests...',
  'Searching web sources...',
];

export const departments: Department[] = [
  { name: 'Planning', nameKr: '기획조정실', color: '#4488ff', agents: ['Tasky', 'Finy', 'Legaly'], center: [-8, 0, -4] },
  { name: 'Risk', nameKr: '리스크챌린지실', color: '#ff4444', agents: ['Skepty'], center: [-8, 0, 4] },
  { name: 'Audit', nameKr: '감사실', color: '#aa44ff', agents: ['Audity'], center: [-4, 0, -8] },
  { name: 'SW Dev', nameKr: 'SW개발본부', color: '#ff8800', agents: ['Pixely', 'Buildy', 'Testy'], center: [0, 0, -6] },
  { name: 'Content', nameKr: '콘텐츠본부', color: '#44ff88', agents: ['Buzzy', 'Wordy', 'Edity', 'Searchy'], center: [4, 0, -4] },
  { name: 'Marketing', nameKr: '마케팅본부', color: '#ff44aa', agents: ['Growthy', 'Logoy', 'Helpy', 'Clicky'], center: [8, 0, -2] },
  { name: 'ICT', nameKr: 'ICT본부', color: '#44ffff', agents: ['Stacky', 'Watchy', 'Guardy'], center: [0, 0, 6] },
  { name: 'HR', nameKr: '인사실', color: '#ffff44', agents: ['Hiry', 'Evaly'], center: [-4, 0, 6] },
  { name: '-y Capital', nameKr: '-y Capital', color: '#ffcc00', agents: ['Quanty', 'Tradey', 'Globy', 'Fieldy', 'Hedgy', 'Valuey'], center: [6, 0, 4] },
  { name: '-y SaaS', nameKr: '-y SaaS', color: '#cccccc', agents: ['Opsy'], center: [4, 0, 8] },
];

function randomStatus(): AgentStatus {
  const r = Math.random();
  if (r < 0.6) return 'active';
  if (r < 0.85) return 'idle';
  return 'offline';
}

function generateAgentPosition(center: [number, number, number], index: number, total: number): [number, number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  const radius = total === 1 ? 0 : 1.5;
  return [
    center[0] + Math.cos(angle) * radius,
    center[1] + (Math.random() - 0.5) * 1.5,
    center[2] + Math.sin(angle) * radius,
  ];
}

export function generateAgents(): Agent[] {
  const agents: Agent[] = [];
  for (const dept of departments) {
    for (let i = 0; i < dept.agents.length; i++) {
      const name = dept.agents[i];
      agents.push({
        id: name.toLowerCase(),
        name,
        department: dept.name,
        departmentKr: dept.nameKr,
        color: dept.color,
        status: randomStatus(),
        lastAction: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
        tasksCompleted: Math.floor(Math.random() * 500) + 50,
        uptime: Math.floor(Math.random() * 20) + 80,
        position: generateAgentPosition(dept.center, i, dept.agents.length),
      });
    }
  }
  return agents;
}

export function randomizeAgents(agents: Agent[]): Agent[] {
  return agents.map(agent => ({
    ...agent,
    status: Math.random() < 0.15 ? randomStatus() : agent.status,
    lastAction: Math.random() < 0.2 ? ACTIONS[Math.floor(Math.random() * ACTIONS.length)] : agent.lastAction,
    tasksCompleted: agent.tasksCompleted + (Math.random() < 0.3 ? Math.floor(Math.random() * 5) : 0),
  }));
}
