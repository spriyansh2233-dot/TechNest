import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Helper component for animating numeric counters smoothly on mount
function StatCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const numericMatch = value.match(/\d+/);
  const target = numericMatch ? parseInt(numericMatch[0], 10) : null;
  const suffix = value.replace(/\d+/g, '');

  useEffect(() => {
    if (target === null) {
      setCount(value);
      return;
    }
    let start = 0;
    const end = target;
    const stepTime = 30;
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = Math.ceil(end / totalSteps);
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      if (start >= end || currentStep >= totalSteps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, target, duration]);

  if (target === null) {
    return <span>{value}</span>;
  }
  return <span>{count}{suffix}</span>;
}

export default function AboutPage() {
  const navigate = useNavigate();

  // Cards configuration for Section 2
  const features = [
    {
      title: "Premium Quality",
      desc: "Carefully selected high-performance gadgets and accessories built with industry-leading craft.",
      icon: "verified",
      color: "#6D5DFC"
    },
    {
      title: "Smart Recommendations",
      desc: "Personalized product discovery tailored directly to your workflow and digital interests.",
      icon: "auto_awesome",
      color: "#8B7CFF"
    },
    {
      title: "Fast & Secure Shopping",
      desc: "Smooth checkout, encrypted payments, and reliable delivery network right to your door.",
      icon: "gpp_good",
      color: "#5B4AE4"
    }
  ];

  // Stats configuration for Section 4
  const stats = [
    { label: "Happy Customers", value: "10K+", icon: "mood" },
    { label: "Premium Products", value: "500+", icon: "inventory_2" },
    { label: "Secure Checkout", value: "100%", icon: "security" },
    { label: "Expert Support", value: "24/7", icon: "support_agent" }
  ];

  return (
    <div className="min-h-screen bg-transparent text-primary py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative overflow-hidden mt-16">
      
      {/* Premium Atmospheric Background Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-[#6D5DFC]/4 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[-15%] w-[700px] h-[700px] bg-[#8B7CFF]/4 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-primary/2 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Decorative cyber grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(109,93,252,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(109,93,252,0.005)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-24 md:space-y-32">
        
        {/* ================= SECTION 1: BRAND STORY ================= */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-2 backdrop-blur-sm">
            <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">explore</span>
            <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest font-semibold">Our Story</span>
          </div>

          <h1 className="font-display-lg text-[38px] md:text-[58px] text-primary leading-tight font-extrabold max-w-4xl mx-auto">
            Designed for <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#8B7CFF] to-[#5B4AE4] neon-text-glow">
              Modern Tech Enthusiasts
            </span>
          </h1>

          <p className="font-body-lg text-lg md:text-xl text-primary font-medium max-w-2xl mx-auto tracking-wide">
            TechHub curates premium gadgets and futuristic accessories designed to elevate your digital lifestyle.
          </p>

          <p className="font-body-md text-on-surface-variant max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            We believe that technology should be an experience, not just utility. By handpicking only the finest accessories and hardware, we deliver a quality-first storefront that bridges premium design and peak functionality. From high-fidelity audio gear to precision wearables, our mission is to ensure every product complements your workspace and workflow seamlessly.
          </p>
        </motion.section>

        {/* ================= SECTION 2: WHY CHOOSE US ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Why TechHub</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">Curated design meets intelligent recommendation systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card relative overflow-hidden group flex flex-col justify-between p-8 rounded-2xl border border-outline bg-surface hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(109,93,252,0.1)] transition-all duration-500 min-h-[220px]"
              >
                {/* Accent glow corner */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]" style={{ color: feat.color }}>
                      {feat.icon}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary">{feat.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 3: MISSION STATEMENT ================= */}
        <section className="relative overflow-hidden py-4">
          <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden rounded-3xl border border-outline bg-gradient-to-br from-[#FFFFFF] via-[#F3F4F6] to-[#FFFFFF] shadow-md">
            {/* Glowing neon divider line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            {/* Spotlight blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">rocket_launch</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Our Mission</h2>
              <p className="text-lg md:text-2xl font-light text-on-surface max-w-3xl mx-auto leading-relaxed italic">
                "To make premium technology more immersive, accessible, and inspiring for modern creators and everyday users."
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: TRUST & STATS ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Trust by the Numbers</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">Global standards in catalog scaling and customer protection.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4 rounded-xl border border-outline bg-surface hover:border-primary/30 hover:shadow-[0_10px_20px_rgba(109,93,252,0.08)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    <StatCounter value={stat.value} />
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 5: CALL TO ACTION ================= */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-6 pb-8"
        >
          <div className="max-w-xl mx-auto space-y-6">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(109, 93, 252, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => navigate('/shop')}
              className="px-10 py-4 bg-primary text-white font-label-caps text-label-caps uppercase rounded-xl font-bold shadow-lg shadow-white/5 transition-all flex items-center gap-3 mx-auto active:scale-95 cursor-pointer hover:bg-secondary hover:shadow-[0_8px_25px_rgba(109,93,252,0.35)]"
            >
              Explore Products
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
