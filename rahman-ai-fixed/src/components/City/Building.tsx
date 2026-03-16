import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  height: number;
  title: string;
  progress: number;
  type: string;
}

export const Building: React.FC<BuildingProps> = ({ position, height, title, progress, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Growth animation
  const targetHeight = Math.max(0.2, (progress / 100) * height);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetHeight, 0.05);
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  const getBuildingColor = () => {
    if (progress >= 100) return '#8B5CF6'; // Completed: Violet
    if (progress >= 50) return '#3B82F6';  // Mid: Blue
    return '#4B5563'; // Foundation: Gray
  };

  return (
    <group position={position}>
      {/* Building Base/Foundation */}
      <Box args={[1, 0.1, 1]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1F2937" />
      </Box>

      {/* Main Building Structure */}
      <Box ref={meshRef} args={[0.8, 1, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={getBuildingColor()} 
          transparent 
          opacity={0.8}
          emissive={getBuildingColor()}
          emissiveIntensity={progress >= 100 ? 0.5 : 0.1}
        />
      </Box>

      {/* Windows/Details (Simplified) */}
      {progress > 20 && (
        <Box args={[0.82, targetHeight, 0.82]} position={[0, targetHeight / 2, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            wireframe 
            transparent 
            opacity={0.1} 
          />
        </Box>
      )}

      {/* Glow effect for completed buildings */}
      {progress >= 100 && (
        <pointLight
          ref={glowRef}
          position={[0, targetHeight + 0.5, 0]}
          color="#8B5CF6"
          distance={3}
          intensity={1}
        />
      )}

      {/* Label */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, targetHeight + 0.8, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`${title}\n${progress}%`}
        </Text>
      </Float>
    </group>
  );
};
