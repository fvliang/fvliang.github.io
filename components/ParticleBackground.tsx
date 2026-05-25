"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  captured: boolean;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const mouseSpeed = useRef(0);
  const lastMouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 50 : 120;
    particles.current = [];
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        captured: false,
      });
    }
  }, []);

  useEffect(() => {
    init();
    const handleResize = () => init();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [init]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      mouseSpeed.current = Math.sqrt(dx * dx + dy * dy);
      lastMouse.current = { x: e.clientX, y: e.clientY };
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const speed = mouseSpeed.current;

      const captureRadius = 150;
      const releaseThreshold = 30;
      const lineMaxDist = 150;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (speed > releaseThreshold) {
          if (p.captured) {
            p.vx = (Math.random() - 0.5) * 3;
            p.vy = (Math.random() - 0.5) * 3;
            p.captured = false;
          }
        } else if (dist < captureRadius && speed < 8) {
          p.captured = true;
        }

        if (p.captured) {
          const angle = Math.atan2(p.y - my, p.x - mx);
          const targetDist = 15 + (i % 15) * 5;
          const tx = mx + Math.cos(angle) * targetDist;
          const ty = my + Math.sin(angle) * targetDist;
          p.x += (tx - p.x) * 0.06;
          p.y += (ty - p.y) * 0.06;
        } else {
          p.x += p.vx;
          p.y += p.vy;

          // Slight attraction when nearby
          if (dist < captureRadius * 1.5 && speed < 10) {
            p.x += dx * 0.002;
            p.y += dy * 0.002;
          }

          // Random walk
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
          p.vx *= 0.99;
          p.vy *= 0.99;

          // Wrap edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }
      }

      // Draw lines between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < lineMaxDist) {
            const alpha = (1 - dist / lineMaxDist) * 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      mouseSpeed.current *= 0.9;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
