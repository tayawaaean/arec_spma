import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { pumpService } from '../../utils/pumpApi';

const PumpModels = () => {
  const [pumpsByModel, setPumpsByModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pumpService.getAllPumps();
      const pumpData = response.data || [];
      
      // Group pumps by model
      const groupedPumps = groupPumpsByModel(pumpData);
      setPumpsByModel(groupedPumps);
    } catch (err) {
      console.error('Error fetching pump models:', err);
      setError('Failed to load pump model data');
    } finally {
      setLoading(false);
    }
  };
  
  // Group pumps by model
  const groupPumpsByModel = (pumpList) => {
    return pumpList.reduce((groups, pump) => {
      if (!groups[pump.model]) {
        groups[pump.model] = [];
      }
      groups[pump.model].push(pump);
      return groups;
    }, {});
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading model data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mb-3">
        {error}
        <div className="mt-2">
          <Button variant="outline-danger" size="sm" onClick={fetchData}>
            <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  // Calculate total pump count for percentages
  const totalPumps = Object.values(pumpsByModel).reduce(
    (sum, pumps) => sum + pumps.length, 
    0
  );

  return (
    <>
      <h6 className="mb-3">
        <FontAwesomeIcon icon={faCubes} className="me-2 text-primary" />
        Pump Models
      </h6>
      
      {Object.entries(pumpsByModel).length === 0 ? (
        <p className="text-muted">No pump models available</p>
      ) : (
        <div className="models-list">
          {Object.entries(pumpsByModel).map(([model, pumps]) => (
            <div key={model} className="model-item mb-3">
              <div className="d-flex justify-content-between">
                <span className="fw-bold">{model}</span>
                <span className="badge bg-primary">{pumps.length}</span>
              </div>
              <div className="progress mt-1">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${(pumps.length / totalPumps) * 100}%` }} 
                  aria-valuenow={(pumps.length / totalPumps) * 100} 
                  aria-valuemin="0" 
                  aria-valuemax="100">
                </div>
              </div>
              <div className="small text-muted mt-1">
                {pumps[0].power} • {pumps[0].maxFlow} • {pumps[0].maxHead}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-3">
        <small className="text-muted">
          Last updated: {new Date().toLocaleTimeString()}
        </small>
      </div>
    </>
  );
};

export default PumpModels;