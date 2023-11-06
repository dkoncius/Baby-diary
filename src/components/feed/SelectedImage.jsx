import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { motion } from 'framer-motion';

export const SelectedImage = ({ selectedMemory, setSelectedMemory, changeImage, currentIndex, totalImages }) => {
  // Animation
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
        <motion.div
        className="selected-memory"
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        >
        <button className='go-back-button' onClick={() => setSelectedMemory(null)}>
            <AiOutlineArrowLeft className='icon' />
        </button>
        <p className='date'>{new Date(selectedMemory.date).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <img src={selectedMemory.images[0]} alt="Selected memory image" />
        <div className="selected-memory-details">
            <p>
            <span>Ūgis</span>
            <span>{selectedMemory.height}</span>
            </p>
            <p>
            <span>Nutaika</span>
            <span>{selectedMemory.mood}</span>
            </p>
            <p>
            <span>Svoris</span>
            <span>{selectedMemory.weight}</span>
            </p>
        </div>

        {/* Add previous and next buttons */}
        <div className="image-navigation">
            <button
            className="previous-button"
            onClick={() => changeImage(-1)} // Go to the previous image
            disabled={currentIndex === 0} // Disable if already at the first image
            >
            <AiOutlineArrowLeft className='icon' />
            </button>
            <button
            className="next-button"
            onClick={() => changeImage(1)} // Go to the next image
            disabled={currentIndex === totalImages - 1} // Disable if already at the last image
            >
            <AiOutlineArrowRight className='icon' />
            </button>
        </div>
        </motion.div>
  )
}
