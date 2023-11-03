import React from 'react';
import {ScrollableInput} from './ScrollableInput';

export const MetricsSection = ({ mood, setMood }) => {
  return (
    <div className="add-memory-metrics">
      <ScrollableInput min={1} step={1} fixedNumber={0} heading={("Ūgis")}/>

      <div className="metric">
        <label htmlFor="mood">Savijauta</label>
        <input
          id='mood'
          type="text" 
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
      </div>

      <ScrollableInput min={0.1} step={0.1} fixedNumber={1} heading={"Svoris"}/>
    </div>
  );
};

