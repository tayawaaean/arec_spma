import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart, Bar, BarChart, ReferenceLine, Brush 
} from 'recharts';
import { ButtonGroup, Button, Dropdown, OverlayTrigger, Tooltip as BSTooltip, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faChartBar, faChartArea, faDownload, faExpand, 
  faCompress, faInfoCircle, faCalendarAlt, faArrowUp, faArrowDown,
  faExclamationTriangle, faSolarPanel, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { pumpDataService } from '../../services/pumpDataService';
import PumpSelector from './PumpSelector';

// Custom tooltip component remains the same
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <div className="tooltip-content">
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="tooltip-item" style={{marginBottom: '8px'}}>
              <div className="d-flex align-items-center mb-1">
                <span 
                  className="tooltip-bullet"
                  style={{
                    backgroundColor: entry.color,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px'
                  }}
                ></span>
                <span className="tooltip-name">{entry.name}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="tooltip-value fw-bold">
                  {entry.value} {entry.unit || ''}
                </span>
                {entry.name === 'Water Volume Produced' && payload.length > 1 && (
                  <span 
                    className={
                      entry.value > payload[1].value 
                      ? "text-success ms-3" 
                      : "text-danger ms-3"
                    }
                  >
                    <FontAwesomeIcon 
                      icon={entry.value > payload[1].value ? faArrowUp : faArrowDown} 
                      className="me-1" 
                    />
                    {Math.abs(((entry.value - payload[1].value) / payload[1].value) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
          {payload.length > 1 && payload[0].payload.efficiency && (
            <div className="tooltip-efficiency mt-2 pt-2 border-top">
              <small className="text-muted">Efficiency:</small>
              <div className="progress mt-1" style={{ height: '6px' }}>
                <div 
                  className={`progress-bar ${payload[0].payload.efficiency >= 0.8 ? 'bg-success' : payload[0].payload.efficiency >= 0.7 ? 'bg-warning' : 'bg-danger'}`}
                  role="progressbar"
                  style={{ width: `${payload[0].payload.efficiency * 100}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <small>{(payload[0].payload.efficiency * 100).toFixed(1)}%</small>
                <small className={payload[0].payload.efficiency >= 0.8 ? 'text-success' : payload[0].payload.efficiency >= 0.7 ? 'text-warning' : 'text-danger'}>
                  {payload[0].payload.efficiency >= 0.8 ? 'Excellent' : payload[0].payload.efficiency >= 0.7 ? 'Good' : 'Needs Improvement'}
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ timeRange }) => {
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBrush, setShowBrush] = useState(false);
  const [totalProduction, setTotalProduction] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [systemEfficiency, setSystemEfficiency] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPump, setSelectedPump] = useState(1); // Default to pump #1
  const chartContainerRef = useRef(null);

  // Handle pump selection
  const handlePumpSelect = (pumpNumber) => {
    setSelectedPump(pumpNumber);
    // Reset loading state to trigger re-fetch with new pump number
    setIsLoading(true);
  };

  // Fetch data based on timeRange and selectedPump
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const interval = pumpDataService.getIntervalFromTimeRange(timeRange);
        const { start, end } = pumpDataService.getDateRange(timeRange);
        
        const response = await pumpDataService.getAggregateData(
          selectedPump, 
          interval,
          start,
          end
        );
        
        if (response && response.intervalData && response.intervalData.length > 0) {
          const formattedData = pumpDataService.formatAggregateData(response.intervalData);
          setChartData(formattedData);
          
          // Update summary stats
          if (response.summary) {
            setTotalProduction(parseFloat((response.summary.total_water_volume || 0).toFixed(2)));
            setTotalConsumption(parseFloat(((response.summary.total_energy_wh || 0) / 1000).toFixed(2)));
            
            // Calculate efficiency
            const efficiency = response.summary.total_energy_wh > 0
              ? parseFloat(((response.summary.total_water_volume / (response.summary.total_energy_wh / 1000)) * 100).toFixed(1))
              : 0;
            setSystemEfficiency(efficiency);
          }
        } else {
          setChartData([]);
          setTotalProduction(0);
          setTotalConsumption(0);
          setSystemEfficiency(0);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching pump data:', err);
        setError('Failed to load performance data');
        setIsLoading(false);
        setChartData([]);
      }
    };
    
    fetchData();
  }, [timeRange, selectedPump]);

  // Fullscreen toggle functionality remains the same
  const toggleFullscreen = () => {
    const elem = chartContainerRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowBrush(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
      setShowBrush(false);
    }
  };
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(isCurrentlyFullscreen);
      setShowBrush(isCurrentlyFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Download chart data as JSON
  const handleDownload = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(chartData, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `pump_${selectedPump}_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Chart rendering logic remains the same
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center mt-5">
          <p className="text-muted">No data available for the selected time period.</p>
        </div>
      );
    }

    // Common chart props
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 20, bottom: showBrush ? 60 : 10 }
    };
    
    // Common axis props
    const axisProps = {
      xAxis: {
        dataKey: "period",
        axisLine: false,
        tickLine: false,
        tick: { fill: '#94a3b8' },
        padding: { left: 10, right: 10 }
      },
      yAxis: {
        axisLine: false,
        tickLine: false,
        tick: { fill: '#94a3b8' },
        width: 55
      },
      cartesianGrid: {
        strokeDasharray: "3 3",
        vertical: false,
        opacity: 0.1
      },
      tooltip: {
        content: <CustomTooltip />,
        cursor: { stroke: 'rgba(255,255,255,0.2)' }
      },
      legend: {
        iconType: "circle",
        wrapperStyle: {
          paddingTop: "20px"
        },
        formatter: (value) => <span style={{ color: '#e2e8f0' }}>{value}</span>
      }
    };

    // Add brush if in fullscreen mode
    const brush = showBrush && (
      <Brush
        dataKey="period"
        height={30}
        stroke="#8884d8"
        startIndex={0}
        endIndex={chartData.length > 5 ? 5 : chartData.length - 1}
        fill="rgba(255, 255, 255, 0.05)"
        travellerWidth={10}
        y={isFullscreen ? 350 : 250}
      />
    );

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid {...axisProps.cartesianGrid} />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} yAxisId="left" />
            <YAxis 
              {...axisProps.yAxis} 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Water (L)', angle: 90, position: 'insideRight', fill: '#94a3b8' }} 
            />
            <Tooltip {...axisProps.tooltip} />
            <Legend {...axisProps.legend} />
            {brush}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="produced" 
              name="Water Volume Produced" 
              stroke="url(#colorProduced)" 
              strokeWidth={3} 
              dot={isFullscreen}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e3a8a' }} 
              unit="L"
              animationDuration={1000}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="consumed" 
              name="Energy Consumption" 
              stroke="url(#colorConsumed)" 
              strokeWidth={3} 
              dot={isFullscreen} 
              activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2, fill: '#991b1b' }} 
              unit="kWh"
              animationDuration={1500}
            />
            <defs>
              <linearGradient id="colorProduced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={1} />
              </linearGradient>
            </defs>
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid {...axisProps.cartesianGrid} />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} yAxisId="left" />
            <YAxis 
              {...axisProps.yAxis} 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Water (L)', angle: 90, position: 'insideRight', fill: '#94a3b8' }} 
            />
            <Tooltip {...axisProps.tooltip} />
            <Legend {...axisProps.legend} />
            {brush}
            <defs>
              <linearGradient id="areaProduced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="areaConsumed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="produced" 
              name="Water Volume Produced" 
              stroke="#3b82f6"
              fill="url(#areaProduced)"
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e3a8a' }} 
              unit="L"
              strokeWidth={3}
              animationDuration={1000}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="consumed" 
              name="Energy Consumption" 
              stroke="#ef4444" 
              fill="url(#areaConsumed)"
              activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2, fill: '#991b1b' }} 
              unit="kWh"
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid {...axisProps.cartesianGrid} />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip {...axisProps.tooltip} />
            <Legend {...axisProps.legend} />
            {brush}
            <defs>
              <linearGradient id="barProduced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="barConsumed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <Bar 
              dataKey="produced" 
              name="Water Volume Produced" 
              fill="url(#barProduced)" 
              radius={[4, 4, 0, 0]}
              unit="L"
              animationDuration={1000}
            />
            <Bar 
              dataKey="consumed" 
              name="Energy Consumption" 
              fill="url(#barConsumed)" 
              radius={[4, 4, 0, 0]}
              unit="kWh"
              animationDuration={1500}
            />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  // Calculate trends for display
  const calculateTrend = (data, key) => {
    if (!data || data.length < 2) return 0;
    const lastValue = data[data.length - 1][key];
    const prevValue = data[data.length - 2][key];
    return prevValue !== 0 ? ((lastValue - prevValue) / prevValue) * 100 : 0;
  };
  
  const productionTrend = chartData.length >= 2 ? calculateTrend(chartData, 'produced') : 0;
  const consumptionTrend = chartData.length >= 2 ? calculateTrend(chartData, 'consumed') : 0;
  
  return (
    <div className={`dashboard-card ${isFullscreen ? 'fullscreen-chart' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Performance Monitoring</h5>
          <OverlayTrigger
            placement="right"
            overlay={
              <BSTooltip id="chart-tooltip">
                Monitor water volume and energy consumption over time
              </BSTooltip>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-muted" />
          </OverlayTrigger>
        </div>
        
        <div className="chart-controls d-flex align-items-center">
          {/* Pump Selector added here */}
          <div className="me-3">
            <PumpSelector 
              onPumpSelect={handlePumpSelect}
              selectedPump={selectedPump}
            />
          </div>
          
          <ButtonGroup className="me-2">
            <OverlayTrigger overlay={<BSTooltip>Line Chart</BSTooltip>}>
              <Button 
                variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setChartType('line')}
                className="btn-chart-type"
              >
                <FontAwesomeIcon icon={faChartLine} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger overlay={<BSTooltip>Area Chart</BSTooltip>}>
              <Button 
                variant={chartType === 'area' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setChartType('area')}
                className="btn-chart-type"
              >
                <FontAwesomeIcon icon={faChartArea} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger overlay={<BSTooltip>Bar Chart</BSTooltip>}>
              <Button 
                variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="btn-chart-type"
              >
                <FontAwesomeIcon icon={faChartBar} />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          
          <OverlayTrigger overlay={<BSTooltip>Download Data</BSTooltip>}>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="icon-btn me-2"
              onClick={handleDownload}
            >
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </OverlayTrigger>
          
          <OverlayTrigger overlay={<BSTooltip>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</BSTooltip>}>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="icon-btn"
              onClick={toggleFullscreen}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
      
      {/* Show pump info badge */}
      <div className="d-flex align-items-center mb-3">
        <Badge bg="primary" className="d-flex align-items-center py-2">
          <FontAwesomeIcon icon={faSolarPanel} className="me-2" />
          Pump #{selectedPump}
          <div className="ms-2 ps-2 border-start">
            {systemEfficiency > 0 && (
              <span className={systemEfficiency >= 80 ? 'text-success' : systemEfficiency >= 70 ? 'text-warning' : 'text-danger'}>
                {systemEfficiency}% Efficiency
              </span>
            )}
          </div>
        </Badge>
      </div>
      
      <div 
        ref={chartContainerRef} 
        className={`chart-container ${isFullscreen ? 'fullscreen-container' : ''}`}
        style={{ height: isFullscreen ? 'calc(100vh - 150px)' : '300px' }}
      >
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading performance data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning mb-3" />
              <p>{error}</p>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setIsLoading(true)} // This will trigger a re-fetch
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="d-flex justify-content-between mt-3">
        <div className="stat-card">
          <div className="text-muted small">Total Water Volume</div>
          <div className="d-flex align-items-baseline">
            <div className="h5 mb-0">{totalProduction.toLocaleString()} L</div>
            {productionTrend !== 0 && (
              <div className={`ms-2 small ${productionTrend > 0 ? 'text-success' : 'text-danger'}`}>
                <FontAwesomeIcon 
                  icon={productionTrend > 0 ? faArrowUp : faArrowDown} 
                  className="me-1" 
                />
                {Math.abs(productionTrend).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-muted small">Total Energy Consumed</div>
          <div className="d-flex align-items-baseline">
            <div className="h5 mb-0">{totalConsumption.toLocaleString()} kWh</div>
            {consumptionTrend !== 0 && (
              <div className={`ms-2 small ${consumptionTrend < 0 ? 'text-success' : 'text-danger'}`}>
                <FontAwesomeIcon 
                  icon={consumptionTrend < 0 ? faArrowDown : faArrowUp} 
                  className="me-1" 
                />
                {Math.abs(consumptionTrend).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-muted small">System Efficiency</div>
          <div className="d-flex flex-column">
            <div className={`h5 mb-0 ${systemEfficiency >= 80 ? 'text-success' : 
                                       systemEfficiency >= 70 ? 'text-warning' : 'text-danger'}`}>
              {systemEfficiency}%
            </div>
            <div className="progress mt-1" style={{height: '5px', width: '100%'}}>
              <div 
                className={`progress-bar ${systemEfficiency >= 80 ? 'bg-success' : 
                                         systemEfficiency >= 70 ? 'bg-warning' : 'bg-danger'}`} 
                role="progressbar" 
                style={{width: `${systemEfficiency}%`}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;