import React from 'react';
import { MetricsInput } from './MetricsInput';

export const MetricsSection = ({ mood, setMood, setHeight, setWeight, weight, height }) => {
  return (
    <div className="add-memory-metrics">
      <MetricsInput min={1} step={1} fixedNumber={0} heading={"Ūgis"} setHeight={setHeight} value={height}/>

      <div className="metric">
        <label htmlFor="mood">Savijauta</label>
        <input
          id="mood"
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
      </div>

      <MetricsInput min={0.1} step={0.1} fixedNumber={1} heading={"Svoris"} setWeight={setWeight} value={weight}/>
    </div>
  );
};
