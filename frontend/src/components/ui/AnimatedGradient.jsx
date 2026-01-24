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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.002; // Speed
      ctx.clearRect(0, 0, w, h);

      // 'screen' blend mode creates a nice glow on dark backgrounds
      ctx.globalCompositeOperation = "screen";

      // --- BLOB 1 (Cyan/Blue) ---
      const x1 = w * (0.3 + Math.sin(t * 0.4) * 0.2);
      const y1 = h * (0.4 + Math.cos(t * 0.6) * 0.2);
      const r1 = w * (0.6 + Math.sin(t * 0.5) * 0.1);

      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      grad1.addColorStop(0, "hsla(210, 100%, 50%, 0.4)"); // Bright Blue
      grad1.addColorStop(1, "hsla(210, 100%, 50%, 0)");

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      // --- BLOB 2 (Purple/Magenta) ---
      const x2 = w * (0.7 + Math.cos(t * 0.5) * 0.2);
      const y2 = h * (0.6 + Math.sin(t * 0.4) * 0.2);
      const r2 = w * (0.5 + Math.cos(t * 0.3) * 0.15);

      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      grad2.addColorStop(0, "hsla(280, 100%, 60%, 0.4)"); // Bright Purple
      grad2.addColorStop(1, "hsla(280, 100%, 60%, 0)");

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

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
      className="absolute inset-0 w-full h-full blur-[80px] opacity-100"
    />
  );
};

export default AnimatedGradient;