export const MetricsInput = ({ min, step, fixedNumber = 0, heading, setWeight, setHeight, value }) => {

  const handleChange = (e) => {
    const newValue = Number(Number(e.target.value).toFixed(fixedNumber));
    
    // Update the weight or height values in the parent component directly
    if (heading === 'Ūgis') {
      setHeight(newValue);
    } else if (heading === 'Svoris') {
      setWeight(newValue);
    }
  };

  return (
    <div className="metric">
      <label htmlFor={heading}>{heading}</label>
      <input
        value={value || ''}
        className="metric-number"
        id={heading}
        type="number"
        step={step.toString()}
        min={min.toString()}
        onChange={handleChange}
      />
    </div>
  );
};
