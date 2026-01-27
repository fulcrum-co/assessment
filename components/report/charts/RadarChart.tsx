import { View, Text, Svg, Polygon, Circle, Line } from '@react-pdf/renderer';
import { colors } from '../primitives/styles';

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
  }[];
  size?: number;
}

export default function RadarChart({ data, size = 200 }: RadarChartProps) {
  const svgSize = size - 40; // Leave room for labels outside SVG
  const center = svgSize / 2;
  const radius = (svgSize - 20) / 2;
  const angleStep = (Math.PI * 2) / data.length;

  // Calculate points for the data polygon
  const getPoint = (value: number, maxValue: number, index: number) => {
    const normalizedValue = value / maxValue;
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const x = center + normalizedValue * radius * Math.cos(angle);
    const y = center + normalizedValue * radius * Math.sin(angle);
    return { x, y };
  };

  // Generate grid lines (concentric polygons)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const generateGridPolygon = (level: number) => {
    return data.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = center + level * radius * Math.cos(angle);
      const y = center + level * radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate data polygon points
  const dataPoints = data.map((item, index) => {
    const point = getPoint(item.value, item.maxValue, index);
    return `${point.x},${point.y}`;
  }).join(' ');

  // Generate axis lines
  const axisLines = data.map((_, index) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  // Calculate label positions for PDF Text elements (relative to container)
  const labelPositions = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelRadius = size / 2 - 5;
    const x = size / 2 + labelRadius * Math.cos(angle);
    const y = size / 2 + labelRadius * Math.sin(angle);
    const percentage = Math.round((item.value / item.maxValue) * 100);

    // Determine text alignment based on position
    let textAlign: 'left' | 'center' | 'right' = 'center';
    if (Math.cos(angle) > 0.3) textAlign = 'left';
    if (Math.cos(angle) < -0.3) textAlign = 'right';

    return { x, y, label: item.label, percentage, textAlign };
  });

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* SVG Chart (centered) */}
      <View style={{ position: 'absolute', top: 20, left: 20 }}>
        <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          {/* Grid polygons */}
          {gridLevels.map((level, i) => (
            <Polygon
              key={`grid-${i}`}
              points={generateGridPolygon(level)}
              stroke={colors.border}
              strokeWidth={0.5}
              fill="none"
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, index) => (
            <Line
              key={`axis-${index}`}
              x1={center}
              y1={center}
              x2={line.x2}
              y2={line.y2}
              stroke={colors.border}
              strokeWidth={0.5}
            />
          ))}

          {/* Data polygon */}
          <Polygon
            points={dataPoints}
            fill={`${colors.accent}33`}
            stroke={colors.accent}
            strokeWidth={2}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const point = getPoint(item.value, item.maxValue, index);
            return (
              <Circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={3}
                fill={colors.accent}
              />
            );
          })}
        </Svg>
      </View>

      {/* Labels as PDF Text (positioned around chart) */}
      {labelPositions.map((pos, index) => (
        <View
          key={`label-${index}`}
          style={{
            position: 'absolute',
            left: pos.x - 30,
            top: pos.y - 8,
            width: 60,
            alignItems: pos.textAlign === 'center' ? 'center' : pos.textAlign === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          <Text style={{ fontSize: 6, color: colors.primary, fontFamily: 'Satoshi' }}>
            {pos.label}
          </Text>
          <Text style={{ fontSize: 7, color: colors.accent, fontFamily: 'Satoshi', fontWeight: 700 }}>
            {pos.percentage}%
          </Text>
        </View>
      ))}
    </View>
  );
}
