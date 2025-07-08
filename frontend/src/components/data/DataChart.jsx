import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

const DataChart = ({ 
  pumpData, 
  pumps, 
  metrics, 
  selectedMetrics, 
  interval,
  chartType = 'line'
}) => {
  // Prepare chart data
  const prepareChartData = () => {
    const timePoints = new Set();
    
    // Collect all time points
    Object.values(pumpData).forEach(dataArray => {
      dataArray.forEach(item => {
        timePoints.add(item.timestamp);
      });
    });
    
    // Sort time points
    const sortedTimePoints = Array.from(timePoints).sort();
    
    // Create data array with all time points
    return sortedTimePoints.map(timestamp => {
      const dataPoint = { timestamp };
      
      // Add data for each pump and metric
      Object.entries(pumpData).forEach(([pumpId, dataArray]) => {
        const pumpIdNum = parseInt(pumpId);
        const pump = pumps.find(p => p.id === pumpIdNum);
        const pumpName = pump ? pump.name : `Pump ${pumpId}`;
        
        // Find matching data point
        const matchingPoint = dataArray.find(item => item.timestamp === timestamp);
        
        if (matchingPoint) {
          selectedMetrics.forEach(metric => {
            dataPoint[`${pumpName}_${metric}`] = matchingPoint[metric];
          });
        }
      });
      
      return dataPoint;
    });
  };

  // Format timestamp based on interval
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    switch (interval) {
      case 'hourly':
        return `${date.getHours()}:00`;
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week ${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const chartData = prepareChartData();
  
  // If no data, show a message
  if (chartData.length === 0) {
    return <div className="text-center py-5">No data available for the selected parameters.</div>;
  }

  // Choose chart component based on type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 10, bottom: 10 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c',
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
              labelFormatter={formatTimestamp}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Legend 
              formatter={(value) => {
                // Extract metric name from combined key
                const parts = value.split('_');
                const metric = parts.pop();
                const pumpName = parts.join('_');
                
                const metricObj = metrics.find(m => m.value === metric);
                const label = metricObj ? metricObj.label : metric;
                
                return <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{`${pumpName} - ${label}`}</span>;
              }}
              iconType="circle"
              wrapperStyle={{ paddingTop: 10 }}
            />
            
            {/* Generate bars for each pump and metric */}
            {Object.entries(pumpData).map(([pumpId, dataArray]) => {
              const pumpIdNum = parseInt(pumpId);
              const pump = pumps.find(p => p.id === pumpIdNum);
              const pumpName = pump ? pump.name : `Pump ${pumpId}`;
              
              return selectedMetrics.map(metric => {
                const metricObj = metrics.find(m => m.value === metric);
                const axisId = ['flow', 'water_volume'].includes(metric) ? 'right' : 'left';
                
                return (
                  <Bar
                    key={`${pumpId}_${metric}`}
                    dataKey={`${pumpName}_${metric}`}
                    name={`${pumpName}_${metric}`}
                    fill={metricObj ? metricObj.color : '#888888'}
                    yAxisId={axisId}
                    radius={[2, 2, 0, 0]}
                    barSize={8}
                  />
                );
              });
            })}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {metrics.map(metric => (
                <linearGradient key={metric.value} id={`color-${metric.value}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c',
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
              labelFormatter={formatTimestamp}
            />
            <Legend 
              formatter={(value) => {
                // Extract metric name from combined key
                const parts = value.split('_');
                const metric = parts.pop();
                const pumpName = parts.join('_');
                
                const metricObj = metrics.find(m => m.value === metric);
                const label = metricObj ? metricObj.label : metric;
                
                return <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{`${pumpName} - ${label}`}</span>;
              }}
              iconType="circle"
              wrapperStyle={{ paddingTop: 10 }}
            />
            
            {/* Generate areas for each pump and metric */}
            {Object.entries(pumpData).map(([pumpId, dataArray]) => {
              const pumpIdNum = parseInt(pumpId);
              const pump = pumps.find(p => p.id === pumpIdNum);
              const pumpName = pump ? pump.name : `Pump ${pumpId}`;
              
              return selectedMetrics.map(metric => {
                const metricObj = metrics.find(m => m.value === metric);
                const axisId = ['flow', 'water_volume'].includes(metric) ? 'right' : 'left';
                
                return (
                  <Area
                    key={`${pumpId}_${metric}`}
                    type="monotone"
                    dataKey={`${pumpName}_${metric}`}
                    name={`${pumpName}_${metric}`}
                    stroke={metricObj ? metricObj.color : '#888888'}
                    fill={`url(#color-${metric})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, stroke: 'rgba(0,0,0,0.2)', strokeWidth: 1 }}
                    yAxisId={axisId}
                  />
                );
              });
            })}
          </AreaChart>
        );

      default: // Line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c',
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
              labelFormatter={formatTimestamp}
            />
            <Legend 
              formatter={(value) => {
                // Extract metric name from combined key
                const parts = value.split('_');
                const metric = parts.pop();
                const pumpName = parts.join('_');
                
                const metricObj = metrics.find(m => m.value === metric);
                const label = metricObj ? metricObj.label : metric;
                
                return <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{`${pumpName} - ${label}`}</span>;
              }}
              iconType="circle"
              wrapperStyle={{ paddingTop: 10 }}
            />
            
            {/* Generate lines for each pump and metric */}
            {Object.entries(pumpData).map(([pumpId, dataArray]) => {
              const pumpIdNum = parseInt(pumpId);
              const pump = pumps.find(p => p.id === pumpIdNum);
              const pumpName = pump ? pump.name : `Pump ${pumpId}`;
              
              return selectedMetrics.map(metric => {
                const metricObj = metrics.find(m => m.value === metric);
                const axisId = ['flow', 'water_volume'].includes(metric) ? 'right' : 'left';
                
                return (
                  <Line
                    key={`${pumpId}_${metric}`}
                    type="monotone"
                    dataKey={`${pumpName}_${metric}`}
                    name={`${pumpName}_${metric}`}
                    stroke={metricObj ? metricObj.color : '#888888'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: 'rgba(0,0,0,0.2)', strokeWidth: 1 }}
                    yAxisId={axisId}
                  />
                );
              });
            })}
          </LineChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default DataChart;