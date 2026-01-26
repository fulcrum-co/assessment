import { View, Svg, Polygon, Circle, Line, Text as SvgText, G } from '@react-pdf/renderer';
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
  const center = size / 2;
  const radius = (size - 60) / 2; // Leave room for labels
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

  // Generate label positions
  const labelPositions = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelRadius = radius + 20;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      label: item.label,
      percentage: Math.round((item.value / item.maxValue) * 100),
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
              r={4}
              fill={colors.accent}
            />
          );
        })}

        {/* Labels */}
        {labelPositions.map((pos, index) => (
          <G key={`label-${index}`}>
            <SvgText
              x={pos.x}
              y={pos.y - 4}
              style={{ fontSize: 7, fill: colors.primary }}
            >
              {pos.label}
            </SvgText>
            <SvgText
              x={pos.x}
              y={pos.y + 6}
              style={{ fontSize: 8, fill: colors.accent, fontWeight: 'bold' }}
            >
              {pos.percentage}%
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
}
