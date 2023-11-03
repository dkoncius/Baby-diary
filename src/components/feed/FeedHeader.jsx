import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const FeedHeader = ({kidData}) => {  // Setting default value for kidData
  const navigate = useNavigate();

  const goToAddMemory = () => {
    navigate("/add-memory", {
      state: { selectedKid: kidData }
    });
  };

  const goToKids = () => {
    navigate("/kids", {
      state: { selectedKid: kidData }
    });
  };

  return (
    <>
      <header>
        <div className="header-kid" onClick={goToKids}>
          <img className="header-kid-image" src={kidData?.image || 'default-image.jpg'} alt="Kid's profile"/> 
          <h2 className="header-kid-name">{kidData?.name || 'Default Name'}</h2> 
        </div>
        <div className="icon" onClick={goToAddMemory}>
          <AiOutlinePlus className='plus'/>
        </div>
      </header>
    </>
  )
}
