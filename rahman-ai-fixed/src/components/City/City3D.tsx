import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei';
import { Building } from './Building';
import { Goal } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface City3DProps {
  goals: Goal[];
  username: string;
  year: string;
}

export const City3D: React.FC<City3DProps> = ({ goals, username, year }) => {
  const [showEntry, setShowEntry] = useState(true);

  return (
    <div className="w-full h-screen bg-brand-indigo relative">
      <AnimatePresence>
        {showEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-brand-indigo/90 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-12 max-w-md w-full text-center space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-display text-white">Welcome, {username}</h2>
                <p className="text-white/40 font-mono uppercase tracking-widest">Sector: {year}</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left space-y-4">
                <p className="text-sm text-white/60 leading-relaxed">
                  Your productivity city is being generated based on your active goals. 
                  Each building represents a milestone in your journey.
                </p>
                <div className="flex justify-between text-xs font-mono text-violet-glow">
                  <span>GOALS DETECTED: {goals.length}</span>
                  <span>STATUS: SYNCED</span>
                </div>
              </div>

              <button
                onClick={() => setShowEntry(false)}
                className="btn-primary w-full justify-center py-4 text-lg"
              >
                Enter City
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={30}
        />
        
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          {/* Ground Grid */}
          <gridHelper args={[50, 50, '#3B82F6', '#1F2937']} position={[0, 0, 0]} />
          
          {/* Buildings */}
          {goals.map((goal, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            return (
              <Building
                key={goal.id}
                position={[(col - 2) * 3, 0, (row - 2) * 3]}
                height={3 + Math.random() * 5}
                title={goal.title}
                progress={goal.progress}
                type={goal.building_type}
              />
            );
          })}

          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.4} 
            scale={50} 
            blur={2} 
            far={4.5} 
          />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="absolute bottom-8 left-8 z-50 pointer-events-none">
        <div className="glass-card p-6 border-l-4 border-l-violet-glow">
          <p className="label-mono mb-1">City Statistics</p>
          <h3 className="text-2xl text-white mb-4">{username}'s Metropolis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase">Total Buildings</p>
              <p className="text-xl font-display text-white">{goals.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase">Avg. Progress</p>
              <p className="text-xl font-display text-white">
                {goals.length > 0 
                  ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
