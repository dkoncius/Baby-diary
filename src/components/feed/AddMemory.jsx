import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx"
import { AiFillPlusCircle } from "react-icons/ai"
import ScrollableInput from '../kids/ScrollableInput';
import { motion } from 'framer-motion';


export const AddMemory = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');


  // Animation
  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <>
     <motion.div 
    className="kids-section"
    variants={variants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5 }}
    >
      <nav className="add-memory-nav">
        <h2>Pridėti prisiminimą</h2>
        <div className="icon" onClick={() => navigate("/feed")}>
          <RxCross1/>
        </div>
      </nav>

      <section className="add-memory-section">
        <input 
          type="file"
          id='file' 
        />
        <label className='file' htmlFor="file">
          <AiFillPlusCircle className='icon'/>
        </label>

        <div className="add-memory-metrics">
          {/* Height */}
          <ScrollableInput min={1} step={1} fixedNumber={0} heading={("Ūgis")}/>

          {/* Mood */}
          <div className="metric">
            <label htmlFor="mood">Savijauta</label>
            <input
              id='mood'
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
          </div>
      
          {/* Weight */}
          <ScrollableInput min={0.1} step={0.1} fixedNumber={1} heading={"Svoris"}/>
        </div>

        <textarea
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className='add-memory-button' onClick={() => navigate("/feed")}>Išsaugoti</button>
      </section>
    </motion.div>
    </>
  )
}
