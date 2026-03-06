'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Agent, departments } from '@/data/agents';

interface SceneProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
}

function AgentNode({ agent, isSelected, onClick }: { agent: Agent; isSelected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const baseIntensity = agent.status === 'active' ? 1 : agent.status === 'idle' ? 0.5 : 0.2;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = agent.status === 'active'
        ? Math.sin(clock.getElapsedTime() * 2 + agent.position[0]) * 0.05 + 0.35
        : 0.3;
      meshRef.current.scale.setScalar(pulse);
    }
    if (glowRef.current) {
      const glowPulse = agent.status === 'active'
        ? Math.sin(clock.getElapsedTime() * 1.5 + agent.position[2]) * 0.15 + 0.7
        : 0.5;
      glowRef.current.scale.setScalar(glowPulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        (agent.status === 'active' ? 0.3 : 0.1) * (isSelected ? 1.5 : 1);
    }
  });

  return (
    <group position={agent.position}>
      {/* Glow sphere */}
      <mesh ref={glowRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.2} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={baseIntensity * (isSelected ? 2 : 1)}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Name label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {agent.name}
      </Text>
      {/* Status indicator */}
      <mesh position={[0.35, 0.4, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={agent.status === 'active' ? '#00ff00' : agent.status === 'idle' ? '#ffaa00' : '#ff0000'}
        />
      </mesh>
    </group>
  );
}

function DepartmentLines({ agents }: { agents: Agent[] }) {
  const lines = useMemo(() => {
    const result: { points: [number, number, number][]; color: string }[] = [];
    for (const dept of departments) {
      const deptAgents = agents.filter(a => a.department === dept.name);
      for (let i = 0; i < deptAgents.length; i++) {
        for (let j = i + 1; j < deptAgents.length; j++) {
          result.push({
            points: [deptAgents[i].position, deptAgents[j].position],
            color: dept.color,
          });
        }
      }
    }
    return result;
  }, [agents]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
}

function DepartmentLabels() {
  return (
    <>
      {departments.map((dept) => (
        <Text
          key={dept.name}
          position={[dept.center[0], 2.5, dept.center[2]]}
          fontSize={0.35}
          color={dept.color}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
          font={undefined}
        >
          {dept.nameKr}
        </Text>
      ))}
    </>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.05} color="#4488ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function SceneContent({ agents, selectedAgent, onSelectAgent }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4488ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff44aa" />
      <pointLight position={[0, 10, 0]} intensity={0.4} color="#44ffff" />

      <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.5} fade speed={1} />
      <FloatingParticles />

      {agents.map((agent) => (
        <AgentNode
          key={agent.id}
          agent={agent}
          isSelected={selectedAgent?.id === agent.id}
          onClick={() => onSelectAgent(agent)}
        />
      ))}

      <DepartmentLines agents={agents} />
      <DepartmentLabels />

      {/* Grid floor */}
      <gridHelper args={[30, 30, '#1a1a3a', '#1a1a3a']} position={[0, -3, 0]} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate
        autoRotateSpeed={0.3}
        minDistance={5}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function Scene({ agents, selectedAgent, onSelectAgent }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [15, 10, 15], fov: 60 }}
      style={{ background: '#0a0a1a' }}
      gl={{ antialias: true, alpha: false }}
    >
      <SceneContent agents={agents} selectedAgent={selectedAgent} onSelectAgent={onSelectAgent} />
    </Canvas>
  );
}
