import React, { useState, useEffect, useRef } from 'react';

function useScrollableInput(min, step, heading) {
  const storageKey = `lastScrollPosition-${heading}`;  // Unique key based on heading
  const [value, setValue] = useState(() => {
    // Retrieve last scroll position from localStorage or default to min + min
    const savedValue = localStorage.getItem(storageKey);
    return savedValue ? parseFloat(savedValue) : min + min;
  });
  const [prevValue, setPrevValue] = useState(null);
  const divRef = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const multiplier = Math.abs(e.deltaY) / 100;  // Change 100 to adjust sensitivity
      let increment = step * multiplier;
      let newValue = Number((Number(value) + (e.deltaY > 0 ? increment : -increment)).toFixed(1));
      newValue = Math.max(min + min, newValue);
      setPrevValue(value);
      setValue(newValue);
    };

    const divElement = divRef.current;
    divElement.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      divElement.removeEventListener('wheel', handleScroll);
    };
  }, [value, step]);

  useEffect(() => {
    // Save last scroll position to localStorage whenever value changes
    localStorage.setItem(storageKey, value);
  }, [value]);

  return {
    value,
    prevValue,
    divRef,
    setValue,
  };
}

export const ScrollableInput = ({min, step, fixedNumber, heading}) => {
  const { value: height, prevValue: prevHeight, divRef, setValue } = useScrollableInput(min, step, heading);

  return (
    <div className="metric" ref={divRef}>
      <label htmlFor="height">{heading}</label>
      <div className="metric-prev-number">{height <= min ? height : (height - step).toFixed(fixedNumber)}</div>
      <input
        className="metric-number"
        id='height'
        type="number"
        value={height}
        onChange={(e) => setValue(Number(Number(e.target.value).toFixed(fixedNumber)))}
      />
      <div className="metric-next-number">{(height + step).toFixed(fixedNumber)}</div>
    </div>
  );
}
