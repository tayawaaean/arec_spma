import React from 'react';

const PumpModels = ({ pumpsByModel }) => {
  return (
    <div>
      <h5 className="mb-3">Pump Models</h5>
      <div className="pump-models">
        {Object.entries(pumpsByModel).map(([model, pumps]) => (
          <div key={model} className="pump-model-card mb-3 p-2 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div className="model-info">
                <h6 className="mb-0">{model}</h6>
                <div className="text-muted small">
                  {pumps[0].power} | {pumps[0].maxFlow} flow
                </div>
              </div>
              <div className="text-center">
                {pumps.some(p => p.status === 'active') && (
                  <span className="badge bg-success me-1">
                    {pumps.filter(p => p.status === 'active').length} Active
                  </span>
                )}
                {pumps.some(p => p.status === 'maintenance') && (
                  <span className="badge bg-warning me-1">
                    {pumps.filter(p => p.status === 'maintenance').length} Maintenance
                  </span>
                )}
                {pumps.some(p => p.status === 'offline') && (
                  <span className="badge bg-danger">
                    {pumps.filter(p => p.status === 'offline').length} Offline
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PumpModels;