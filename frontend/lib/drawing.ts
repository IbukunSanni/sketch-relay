// A drawing is a list of strokes. The canvas keeps only pixels, so undo
// works by repainting every stroke that is left.

export type Point = { x: number; y: number; pressure: number };

export type Stroke = { color: string; width: number; points: Point[] };

export const COLORS = [
  { name: "Black", value: "#1f1f1f" },
  { name: "Red", value: "#e53935" },
  { name: "Orange", value: "#fb8c00" },
  { name: "Green", value: "#43a047" },
  { name: "Blue", value: "#1e88e5" },
  { name: "Purple", value: "#8e24aa" },
] as const;

export const SIZES = [
  { name: "Small", width: 3 },
  { name: "Medium", width: 8 },
  { name: "Large", width: 18 },
] as const;

// A mouse reports 0.5 while pressed, so it draws at the chosen width; a pen
// ranges from almost nothing to twice the width. Some devices report 0 for
// a press they can't measure, which would otherwise draw nothing.
export function lineWidth(width: number, pressure: number): number {
  const p = pressure > 0 ? pressure : 0.5;
  return width * p * 2;
}

export function paintBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawDot(ctx: CanvasRenderingContext2D, stroke: Stroke, p: Point) {
  ctx.fillStyle = stroke.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, lineWidth(stroke.width, p.pressure) / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Each segment gets its own width, and round caps hide the joins.
export function drawSegment(ctx: CanvasRenderingContext2D, stroke: Stroke, a: Point, b: Point) {
  ctx.strokeStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineWidth = lineWidth(stroke.width, (a.pressure + b.pressure) / 2);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const [first, ...rest] = stroke.points;
  if (!first) return;
  drawDot(ctx, stroke, first);
  let prev = first;
  for (const p of rest) {
    drawSegment(ctx, stroke, prev, p);
    prev = p;
  }
}
