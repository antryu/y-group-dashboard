export type AgentStatus = 'active' | 'idle' | 'offline';

export interface Agent {
  id: string;
  name: string;
  number: string;
  image: string;
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
  { name: 'Marketing', nameKr: '마케팅본부', color: '#ff44aa', agents: ['Growthy', 'Logoy', 'Helpy', 'Clicky', 'Selly'], center: [8, 0, -2] },
  { name: 'ICT', nameKr: 'ICT본부', color: '#44ffff', agents: ['Stacky', 'Watchy', 'Guardy'], center: [0, 0, 6] },
  { name: 'HR', nameKr: '인사실', color: '#ffff44', agents: ['Hiry', 'Evaly'], center: [-4, 0, 6] },
  { name: '_y Capital', nameKr: '_y Capital', color: '#ffcc00', agents: ['Quanty', 'Tradey', 'Globy', 'Fieldy', 'Hedgy', 'Valuey'], center: [6, 0, 4] },
  { name: '_y SaaS', nameKr: '_y SaaS', color: '#cccccc', agents: ['Opsy'], center: [4, 0, 8] },
];

const AGENT_META: Record<string, { number: string; image: string }> = {
  Tasky: { number: '01', image: '/agents/01-tasky.png' },
  Finy: { number: '02', image: '/agents/02-finy.png' },
  Legaly: { number: '03', image: '/agents/03-legaly.png' },
  Skepty: { number: '04', image: '/agents/04-skepty.png' },
  Audity: { number: '05', image: '/agents/05-audity.png' },
  Pixely: { number: '06', image: '/agents/06-pixely.png' },
  Buildy: { number: '07', image: '/agents/07-buildy.png' },
  Testy: { number: '08', image: '/agents/08-testy.png' },
  Buzzy: { number: '09', image: '/agents/09-buzzy.png' },
  Wordy: { number: '10', image: '/agents/10-wordy.png' },
  Edity: { number: '11', image: '/agents/11-edity.png' },
  Searchy: { number: '12', image: '/agents/12-searchy.png' },
  Growthy: { number: '13', image: '/agents/13-growthy.png' },
  Logoy: { number: '14', image: '/agents/14-logoy.png' },
  Helpy: { number: '15', image: '/agents/15-helpy.png' },
  Clicky: { number: '16', image: '/agents/16-clicky.png' },
  Selly: { number: '17', image: '/agents/17-selly.png' },
  Stacky: { number: '18', image: '/agents/18-stacky.png' },
  Watchy: { number: '19', image: '/agents/19-watchy.png' },
  Guardy: { number: '20', image: '/agents/20-guardy.png' },
  Hiry: { number: '21', image: '/agents/21-hiry.png' },
  Evaly: { number: '22', image: '/agents/22-evaly.png' },
  Quanty: { number: '23', image: '/agents/23-quanty.png' },
  Tradey: { number: '24', image: '/agents/24-tradey.png' },
  Globy: { number: '25', image: '/agents/25-globy.png' },
  Fieldy: { number: '26', image: '/agents/26-fieldy.png' },
  Hedgy: { number: '27', image: '/agents/27-hedgy.png' },
  Valuey: { number: '28', image: '/agents/28-valuey.png' },
  Opsy: { number: '29', image: '/agents/29-opsy.png' },
};

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
      const meta = AGENT_META[name] || { number: '??', image: '' };
      agents.push({
        id: name.toLowerCase(),
        name,
        number: meta.number,
        image: meta.image,
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
