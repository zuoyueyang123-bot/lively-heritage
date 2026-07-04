"use client";

import { useEffect, useRef } from "react";

/**
 * Animated heritage-inspired particle canvas for the hero section.
 * Renders flowing golden particles with cultural motif shapes.
 */
export function HeroParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth * 2;
      h = canvas.offsetHeight * 2;
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number;
      shape: "circle" | "diamond" | "petal";
      life: number; maxLife: number;
    };

    const particles: Particle[] = [];
    const maxParticles = 80;

    function spawn() {
      if (particles.length >= maxParticles) return;
      const shape = (["circle", "diamond", "petal"] as const)[Math.floor(Math.random() * 3)];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.5,
        size: 3 + Math.random() * 6,
        alpha: 0,
        hue: 35 + Math.random() * 20, // gold range
        shape,
        life: 0,
        maxLife: 200 + Math.random() * 200,
      });
    }

    function drawParticle(p: Particle) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);

      const color = `hsla(${p.hue}, 65%, 55%, ${p.alpha})`;
      ctx.fillStyle = color;
      ctx.strokeStyle = `hsla(${p.hue}, 70%, 70%, ${p.alpha * 0.5})`;
      ctx.lineWidth = 0.8;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "diamond") {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.7, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Petal shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.6, p.size * 0.4, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.4, 0, -p.size);
        ctx.fill();
      }
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Spawn new particles
      if (Math.random() < 0.15) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.01) * 0.3;
        p.y += p.vy;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.alpha = lifeRatio / 0.15 * 0.6;
        } else if (lifeRatio > 0.7) {
          p.alpha = (1 - lifeRatio) / 0.3 * 0.6;
        } else {
          p.alpha = 0.6;
        }

        // Remove dead particles
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > w + 20) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(p);
      }

      // Subtle connecting lines between nearby particles
      ctx.strokeStyle = "rgba(196, 160, 80, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
