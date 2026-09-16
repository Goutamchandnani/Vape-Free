import type { DailyPuffPoint } from '@/lib/progress-chart';

export interface ChartPoint {
  x: number;
  y: number;
}

export interface PuffTrendChartGeometry {
  width: number;
  height: number;
  padding: number;
  maxValue: number;
  points: ChartPoint[];
  linePath: string;
  areaPath: string;
}

/**
 * Builds SVG path geometry for a seven-day puff trend chart.
 *
 * @param series - Ordered daily puff totals.
 * @param width - Chart viewport width.
 * @param height - Chart viewport height.
 * @returns Line and area paths plus normalised point coordinates.
 */
export function buildPuffTrendChartGeometry(
  series: DailyPuffPoint[],
  width = 320,
  height = 160,
): PuffTrendChartGeometry {
  const padding = 16;
  const maxValue = Math.max(...series.map((point) => point.puffCount), 1);
  const innerWidth = Math.max(width - padding * 2, 1);
  const innerHeight = Math.max(height - padding * 2, 1);
  const stepX = series.length > 1 ? innerWidth / (series.length - 1) : 0;

  const points = series.map((point, index) => {
    const x = padding + stepX * index;
    const ratio = point.puffCount / maxValue;
    const y = padding + innerHeight - ratio * innerHeight;

    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const baselineY = padding + innerHeight;
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? padding} ${baselineY} L ${points[0]?.x ?? padding} ${baselineY} Z`;

  return {
    width,
    height,
    padding,
    maxValue,
    points,
    linePath,
    areaPath,
  };
}
