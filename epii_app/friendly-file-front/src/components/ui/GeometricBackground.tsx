
import { useState, useEffect, useRef } from "react";
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority,
  AnimationId
} from "../../subsystems/2_parashakti/1_utils/AnimationManager";

interface GeometricBackgroundProps {
  density?: number;
  speed?: number;
  opacity?: number;
  color?: string;
  className?: string;
}

const GeometricBackground = ({
  density = 20,
  speed = 0.5,
  opacity = 0.05,
  color = "#00E5FF",
  className = ""
}: GeometricBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Animation ID reference
  const animationIdRef = useRef<AnimationId | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Points array
    const points: { x: number; y: number; vx: number; vy: number }[] = [];

    // Create random points
    for (let i = 0; i < density; i++) {
      points.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed
      });
    }

    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Register the animation with the AnimationManager
    const animationId = animationManager.registerAnimation(
      () => {
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Update points
        points.forEach(point => {
          point.x += point.vx;
          point.y += point.vy;

          // Bounce on edges
          if (point.x < 0 || point.x > dimensions.width) point.vx *= -1;
          if (point.y < 0 || point.y > dimensions.height) point.vy *= -1;
        });

        // Draw connections
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const maxDistance = 150;

            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
              ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity * (1 - distance / maxDistance)})`;
              ctx.stroke();
            }
          }
        }

        // Draw points
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity * 2})`;
          ctx.fill();
        });
      },
      {
        subsystem: AnimationSubsystem.ANUTTARA,
        category: AnimationCategory.SYSTEM,
        priority: AnimationPriority.LOW, // Background animation is low priority
        updateInterval: 33, // Keep at ~30fps as this is sufficient for background animation
        name: 'Geometric Background Animation'
      }
    );

    // Store the animation ID
    animationIdRef.current = animationId;

    // Start the animation manager if not already started
    if (!animationManager.getIsRunning()) {
      animationManager.start();
    }

    // Clean up animation on unmount
    return () => {
      // Unregister the animation
      if (animationIdRef.current) {
        const animationManager = getAnimationManager();
        animationManager.unregisterAnimation(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [dimensions, density, speed, opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default GeometricBackground;
