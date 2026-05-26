import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HeadphoneModel() {
  const groupRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse positions to -1 to 1 relative to window center
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth interpolation (lerp) towards mouse position for responsive movement
    const targetX = mouse.x * 0.35;
    const targetY = mouse.y * 0.25;
    
    // Smooth natural floating animation using clock time
    const time = state.clock.getElapsedTime();
    const floatY = Math.sin(time * 1.8) * 0.12;
    
    // Continuous rotation combined with mouse following
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX + time * 0.22, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.04);
  });

  return (
    // Scaled down to fit perfectly on all screen resolutions without clipping
    <group ref={groupRef} scale={[1.3, 1.3, 1.3]}>
      
      {/* 1. Headband arch (Centered vertically at Y offset 0.45) */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.2, 0.07, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#2d2d30" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Headband padding cushion */}
      <mesh position={[0, 0.47, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.18, 0.11, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#0b0b0d" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* 2. Left Hanger/Arm (Shifted relative to new center) */}
      <group position={[-1.2, -0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#5e6065" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Joint */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* 3. Right Hanger/Arm (Shifted relative to new center) */}
      <group position={[1.2, -0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#5e6065" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Joint */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Left Ear Cup (Shifted relative to new center) */}
      <group position={[-1.2, -0.45, 0]} rotation={[0, 0, -0.15]}>
        {/* Outer Cup housing */}
        <mesh>
          <cylinderGeometry args={[0.55, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#151518" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Metallic accent ring - Red */}
        <mesh position={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.05, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f42c37" roughness={0.1} metalness={1.0} emissive="#f42c37" emissiveIntensity={0.35} />
        </mesh>
        {/* Inner glow ring */}
        <mesh position={[-0.15, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.5} emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.55, 0.25, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#111115" roughness={0.9} metalness={0.05} />
        </mesh>
      </group>

      {/* 5. Right Ear Cup (Shifted relative to new center) */}
      <group position={[1.2, -0.45, 0]} rotation={[0, 0, 0.15]}>
        {/* Outer Cup housing */}
        <mesh>
          <cylinderGeometry args={[0.55, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#151518" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Metallic accent ring - Red */}
        <mesh position={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.05, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f42c37" roughness={0.1} metalness={1.0} emissive="#f42c37" emissiveIntensity={0.35} />
        </mesh>
        {/* Inner glow ring */}
        <mesh position={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.5} emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[-0.15, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.55, 0.25, 32]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#111115" roughness={0.9} metalness={0.05} />
        </mesh>
      </group>

    </group>
  );
}

export default function InteractiveHeadphone() {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[480px] relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5.0], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.75} />
        {/* Main studio Key light from top right */}
        <directionalLight position={[5, 8, 5]} intensity={2.0} />
        {/* Magenta rim highlight from upper right */}
        <pointLight position={[6, 6, 6]} intensity={1.8} color="#f42c37" />
        {/* Cyan fill light from bottom left */}
        <pointLight position={[-6, -6, -4]} intensity={1.0} color="#00e5ff" />
        {/* Subtle front fill light */}
        <directionalLight position={[-3, 2, 4]} intensity={0.8} />
        <HeadphoneModel />
      </Canvas>
    </div>
  );
}
