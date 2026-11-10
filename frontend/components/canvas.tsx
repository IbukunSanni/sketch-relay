"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import {
  COLORS,
  SIZES,
  type Point,
  type Stroke,
  drawDot,
  drawSegment,
  drawStroke,
  paintBackground,
} from "@/lib/drawing";

// Every drawing is 800 × 600 pixels on every device, so the next player sees
// it the same; on a narrow screen the canvas is shown smaller, not cropped.
const WIDTH = 800;
const HEIGHT = 600;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<{ pointerId: number; stroke: Stroke } | null>(null);
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [width, setWidth] = useState<number>(SIZES[1].width);

  // The canvas starts transparent; white pixels make the exported PNG match
  // what's on screen.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) paintBackground(ctx);
  }, []);

  function context() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function repaint() {
    const ctx = context();
    if (!ctx) return;
    paintBackground(ctx);
    for (const stroke of strokes.current) drawStroke(ctx, stroke);
  }

  // Pointer offsets are in CSS pixels; scale them to canvas pixels.
  function toPoint(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = e.currentTarget;
    return {
      x: (e.nativeEvent.offsetX * canvas.width) / canvas.clientWidth,
      y: (e.nativeEvent.offsetY * canvas.height) / canvas.clientHeight,
      pressure: e.pressure,
    };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    // One stroke at a time: a second finger is ignored.
    if (active.current) return;
    const ctx = context();
    if (!ctx) return;
    // Keeps the stroke going when the pointer leaves the canvas mid-line.
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toPoint(e);
    const stroke: Stroke = { color, width, points: [p] };
    active.current = { pointerId: e.pointerId, stroke };
    drawDot(ctx, stroke, p);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    const current = active.current;
    if (!current || current.pointerId !== e.pointerId) return;
    const ctx = context();
    if (!ctx) return;
    const p = toPoint(e);
    const points = current.stroke.points;
    drawSegment(ctx, current.stroke, points[points.length - 1], p);
    points.push(p);
  }

  function handlePointerEnd(e: ReactPointerEvent<HTMLCanvasElement>) {
    const current = active.current;
    if (!current || current.pointerId !== e.pointerId) return;
    strokes.current.push(current.stroke);
    active.current = null;
  }

  function undo() {
    strokes.current.pop();
    repaint();
  }

  function clear() {
    strokes.current = [];
    repaint();
  }

  function exportPng() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sketch-relay.png";
      link.click();
      // Revoking at once can cancel the download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  const button =
    "rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div role="group" aria-label="Colour" className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={c.name}
              aria-pressed={c.value === color}
              onClick={() => setColor(c.value)}
              className={`h-8 w-8 rounded-full border-2 ${
                c.value === color ? "border-zinc-900 dark:border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <div role="group" aria-label="Size" className="flex gap-2">
          {SIZES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-label={s.name}
              aria-pressed={s.width === width}
              onClick={() => setWidth(s.width)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                s.width === width ? "border-zinc-900 dark:border-white" : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <span
                className="rounded-full bg-zinc-900 dark:bg-white"
                style={{ width: 4 + i * 5, height: 4 + i * 5 }}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={undo} className={button}>
            Undo
          </button>
          <button type="button" onClick={clear} className={button}>
            Clear
          </button>
          <button type="button" onClick={exportPng} className={button}>
            Export PNG
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="h-auto w-full touch-none border border-zinc-300 bg-white"
      />
    </div>
  );
}
