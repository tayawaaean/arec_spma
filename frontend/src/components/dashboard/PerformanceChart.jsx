import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart, Bar, BarChart
} from 'recharts';
import { ButtonGroup, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faChartBar, faChartArea,
  faDownload, faExpand
} from '@fortawesome/free-solid-svg-icons';

const data = [
  { month: 'Jan', produced: 270, consumed: 120, efficiency: 0.8 },
  { month: 'Feb', produced: 240, consumed: 380, efficiency: 0.75 },
  { month: 'Mar', produced: 250, consumed: 170, efficiency: 0.83 },
  { month: 'Apr', produced: 180, consumed: 350, efficiency: 0.7 },
  { month: 'May', produced: 220, consumed: 450, efficiency: 0.72 },
  { month: 'Jun', produced: 300, consumed: 250, efficiency: 0.85 },
  { month: 'Jul', produced: 180, consumed: 430, efficiency: 0.68 }
];

const PerformanceChart = ({ timeRange }) => {
  const [chartType, setChartType] = useState('line');
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [chartData] = useState(data);
  
  useEffect(() => {
    // In a real app, you would fetch different data based on timeRange
    console.log(`Chart would load ${timeRange} data`);
  }, [timeRange]);
  
  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161b22',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="produced" 
              name="Water Volume Produced" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="consumed" 
              name="Energy Consumption" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161b22',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="produced" 
              name="Energy Produced" 
              stroke="#3b82f6"
              fill="#3b82f620"
              activeDot={{ r: 8 }} 
            />
            <Area 
              type="monotone" 
              dataKey="consumed" 
              name="Energy Consumption" 
              stroke="#ef4444" 
              fill="#ef444420"
              activeDot={{ r: 8 }} 
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161b22',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#e2e8f0'
              }} 
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
            />
            <Bar dataKey="produced" name="Energy Produced" fill="#3b82f6" />
            <Bar dataKey="consumed" name="Energy Consumption" fill="#ef4444" />
          </BarChart>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="dashboard-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Performance Monitoring</h5>
          <span className="badge bg-success ms-2">+15% Efficiency</span>
        </div>
        
        <div className="chart-controls">
          <ButtonGroup className="me-2">
            <Button 
              variant={chartType === 'line' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <FontAwesomeIcon icon={faChartLine} />
            </Button>
            <Button 
              variant={chartType === 'area' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <FontAwesomeIcon icon={faChartArea} />
            </Button>
            <Button 
              variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <FontAwesomeIcon icon={faChartBar} />
            </Button>
          </ButtonGroup>
          
          <Dropdown className="d-inline-block me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm" id="period-dropdown">
              {chartPeriod === 'daily' ? 'Daily' : 
               chartPeriod === 'weekly' ? 'Weekly' : 'Monthly'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setChartPeriod('daily')}>Daily</Dropdown.Item>
              <Dropdown.Item onClick={() => setChartPeriod('weekly')}>Weekly</Dropdown.Item>
              <Dropdown.Item onClick={() => setChartPeriod('monthly')}>Monthly</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Button variant="link" className="text-secondary p-0" title="Download Data">
            <FontAwesomeIcon icon={faDownload} />
          </Button>
          <Button variant="link" className="text-secondary p-0 ms-2" title="Fullscreen">
            <FontAwesomeIcon icon={faExpand} />
          </Button>
        </div>
      </div>
      
      <div className="chart-container" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      <div className="d-flex justify-content-between mt-3">
        <div className="stat-card">
          <div className="text-muted small">Total Production</div>
          <div className="h5 mb-0">1,640 kWh</div>
        </div>
        <div className="stat-card">
          <div className="text-muted small">Total Consumption</div>
          <div className="h5 mb-0">1,750 kWh</div>
        </div>
        <div className="stat-card text-success">
          <div className="text-muted small">System Efficiency</div>
          <div className="h5 mb-0">76.2%</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;