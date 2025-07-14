import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SolarStats from '../components/dashboard/SolarStats';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import MonthlyGeneration from '../components/dashboard/MonthlyGeneration';
import SlidingPanel from '../components/dashboard/SlidingPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSolarPanel, faChartLine, faCloudSun, faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

// Import the sliding panel styles
import '../styles/sliding-panel.css';

const Dashboard = () => {
  // Keep timeRange with a fixed value since we removed the selector
  const timeRange = 'month';
  const currentUser = 'Dextiee';
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Strip down components to just their content
  const solarStatsContent = (
    <div className="panel-content">
      <SolarStats 
        timeRange={timeRange} 
        currentUser={currentUser} 
        currentDateTime={currentDateTime}
      />
    </div>
  );
  
  const performanceChartContent = (
    <div className="panel-content">
      <PerformanceChart timeRange={timeRange} />
    </div>
  );
  
  const weatherWidgetContent = (
    <div className="panel-content">
      <WeatherWidget />
    </div>
  );
  
  const monthlyGenerationContent = (
    <div className="panel-content">
      <MonthlyGeneration />
    </div>
  );

  return (
    <Container fluid className="dashboard-container p-0">
      
      
      <Row>
        {/* First sliding panel (Solar Stats & Performance Chart) */}
        <Col lg={8}>
          <SlidingPanel
            leftComponent={solarStatsContent}
            rightComponent={performanceChartContent}
            leftTitle="Solar Stats"
            rightTitle="Performance"
            leftIcon={faSolarPanel}
            rightIcon={faChartLine}
          />
        </Col>
        
        {/* Second sliding panel (Weather Widget & Monthly Generation) */}
        <Col lg={4}>
          <SlidingPanel
            leftComponent={weatherWidgetContent}
            rightComponent={monthlyGenerationContent}
            leftTitle="Weather"
            rightTitle="Monthly Generation"
            leftIcon={faCloudSun}
            rightIcon={faCalendarDay}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;