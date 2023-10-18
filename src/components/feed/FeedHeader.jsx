import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const Header = ({kidData}) => {
  console.log(kidData)

  const navigate = useNavigate()

  return (
    <>
        <header>
            <div className="header-kid" onClick={() => navigate("/kids")}>
                <img className="header-kid-image" src={kidData.image} alt="profile-1.jpg"/>
                <h2 className="header-kid-name">{kidData.name}</h2>
            </div>
            <div className="icon" onClick={() => navigate("/add-memory")}>
              <AiOutlinePlus className='plus'/>
            </div>
        </header>
    </>
  )
}
