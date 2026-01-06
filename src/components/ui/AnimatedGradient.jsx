import { useEffect, useRef } from "react";

const AnimatedGradient = () => {
  const canvasRef = useRef(null);
  const frame = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // 🔑 reset
      ctx.scale(dpr, dpr);

      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // 1. Slower time step for smoother, floaty animation
      t += 0.0025;

      ctx.clearRect(0, 0, w, h);

      // Use 'lighter' blend mode for the glowing overlap effect
      ctx.globalCompositeOperation = "lighter";

      // --- BLOB 1: Your Original Blue/Purple ---
      // Math: Mismatched sine/cos speeds (0.6 vs 0.7) creates a wandering path
      const x1 = w * (0.5 + Math.sin(t * 0.6) * 0.25);
      const y1 = h * (0.5 + Math.cos(t * 0.7) * 0.2);
      const r1 = w * (0.8 + Math.sin(t * 0.5) * 0.1); // Pulsating size

      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      // Exact colors from your snippet
      grad1.addColorStop(0, "hsla(220, 85%, 65%, 0.9)");
      grad1.addColorStop(1, "hsla(260, 85%, 60%, 0)");

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      // --- BLOB 2: Your Original Pink/Magenta ---
      // Math: Different speeds (0.8 vs 0.5) so it never perfectly syncs with Blob 1
      const x2 = w * (0.5 + Math.cos(t * 0.8) * 0.25);
      const y2 = h * (0.5 + Math.sin(t * 0.5) * 0.2);
      const r2 = w * (0.7 + Math.cos(t * 0.3) * 0.15); // Pulsating size

      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      // Exact colors from your snippet
      grad2.addColorStop(0, "hsla(310, 90%, 65%, 0.75)");
      grad2.addColorStop(1, "hsla(310, 90%, 60%, 0)");

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // Reset blend mode
      ctx.globalCompositeOperation = "source-over";

      frame.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Increased blur slightly (blur-3xl -> blur-[80px]) for smoother blending
      className="absolute inset-0 w-full h-full blur-[80px] opacity-90"
    />
  );
};

export default AnimatedGradient;
