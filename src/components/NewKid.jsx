import React, { useState } from 'react';
import { motion } from 'framer-motion';

const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

export const NewKid = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [date, setDate] = useState('');

    return (
        <>
        <div className="new-kid-form-image"></div>
    
        <motion.form
          className='new-kid-form'
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <h1>Vaiko duomenys</h1>
          <input type="text" placeholder='Vardas Pavardė' />
           <input 
                type={isFocused || date ? "date" : "text"} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setDate(e.target.value)}
                value={date}
                placeholder="Gimimo data"
                className="date-input"
            />
          <input type="number" min="0" placeholder='Ūgis' />
          <input type="number" min="0" placeholder='Svoris' />
          <button type="submit">IŠSAUGOTI</button>

        </motion.form>
        </>
       
      );
}
