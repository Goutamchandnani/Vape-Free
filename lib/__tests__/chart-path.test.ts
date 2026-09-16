import { buildPuffTrendChartGeometry } from '@/lib/chart-path';
import type { DailyPuffPoint } from '@/lib/progress-chart';

describe('chart-path', () => {
  const series: DailyPuffPoint[] = [
    { dateKey: '2026-09-01', label: 'Mon', puffCount: 10 },
    { dateKey: '2026-09-02', label: 'Tue', puffCount: 20 },
    { dateKey: '2026-09-03', label: 'Wed', puffCount: 5 },
  ];

  it('builds line and area paths for the puff trend chart', () => {
    const geometry = buildPuffTrendChartGeometry(series, 300, 160);

    expect(geometry.points).toHaveLength(3);
    expect(geometry.linePath.startsWith('M')).toBe(true);
    expect(geometry.areaPath.endsWith('Z')).toBe(true);
    expect(geometry.maxValue).toBe(20);
  });
});
