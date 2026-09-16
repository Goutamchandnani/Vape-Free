import { useMemo, useState } from 'react';
import { View, type LayoutChangeEvent, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { colors } from '@/constants/theme';
import { buildPuffTrendChartGeometry, type ChartPoint } from '@/lib/chart-path';
import type { DailyPuffPoint } from '@/lib/progress-chart';

export interface PuffTrendChartProps {
  series: DailyPuffPoint[];
  weekOverWeekChange: number | null;
  isLoading: boolean;
}

const CHART_HEIGHT = 160;

function formatWeekOverWeekLabel(change: number | null): string {
  if (change === null) {
    return 'No prior week data';
  }

  if (change === 0) {
    return '0% vs last week';
  }

  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change}% vs last week`;
}

function lineSegmentStyle(from: ChartPoint, to: ChartPoint, color: string): ViewStyle {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY);
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  const centerX = (from.x + to.x) / 2;
  const centerY = (from.y + to.y) / 2;

  return {
    position: 'absolute',
    left: centerX - length / 2,
    top: centerY - 2,
    width: length,
    height: 4,
    backgroundColor: color,
    borderRadius: 999,
    transform: [{ rotate: `${angle}deg` }],
  };
}

/**
 * Seven-day puff trend card with a View-based line chart (Expo Go safe).
 *
 * @param props - Daily puff series and week-over-week change.
 * @returns Progress chart card aligned to the wireframe.
 */
export function PuffTrendChart({ series, weekOverWeekChange, isLoading }: PuffTrendChartProps) {
  const [chartWidth, setChartWidth] = useState(320);

  const geometry = useMemo(
    () => buildPuffTrendChartGeometry(series, chartWidth, CHART_HEIGHT),
    [chartWidth, series],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  return (
    <View className="gap-gutter">
      <View className="flex-row items-end justify-between">
        <View>
          <AppText variant="headlineMd" color="onSurface">
            Puff Count Trend
          </AppText>
          <AppText variant="labelMd" color="onSurfaceVariant" className="mt-1">
            Last 7 Days
          </AppText>
        </View>

        <View className="rounded-full bg-surface-container-high px-4 py-1.5">
          <AppText variant="labelSm" color="primary">
            {isLoading ? '...' : formatWeekOverWeekLabel(weekOverWeekChange)}
          </AppText>
        </View>
      </View>

      <Card accessible accessibilityLabel="Seven day puff count trend chart">
        <View onLayout={handleLayout} style={{ height: CHART_HEIGHT + 32 }}>
          {[0, 0.5, 1].map((ratio) => {
            const y = geometry.padding + (CHART_HEIGHT - geometry.padding * 2) * ratio;

            return (
              <View
                key={ratio}
                style={{
                  position: 'absolute',
                  left: geometry.padding,
                  right: geometry.padding,
                  top: y,
                  borderTopWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.surfaceContainerHigh,
                }}
              />
            );
          })}

          {!isLoading
            ? geometry.points.slice(0, -1).map((point, index) => {
                const nextPoint = geometry.points[index + 1];

                if (!nextPoint) {
                  return null;
                }

                return (
                  <View
                    key={`${point.x}-${point.y}`}
                    style={lineSegmentStyle(point, nextPoint, colors.primaryContainer)}
                  />
                );
              })
            : null}

          {!isLoading
            ? geometry.points.map((point, index) => (
                <View
                  key={series[index]?.dateKey ?? index}
                  style={{
                    position: 'absolute',
                    left: point.x - 5,
                    top: point.y - 5,
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: colors.surfaceContainerLowest,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}
                  accessibilityLabel={`${series[index]?.label ?? 'Day'}, ${series[index]?.puffCount ?? 0} puffs`}
                />
              ))
            : null}

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: CHART_HEIGHT,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: geometry.padding - 8,
            }}
          >
            {series.map((point) => (
              <AppText key={point.dateKey} variant="labelSm" color="outline" className="text-center">
                {point.label}
              </AppText>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
}
