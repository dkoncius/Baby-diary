import { HiBars3 } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

export const Header = () => {

  const navigate = useNavigate()

  const openKids = () => {
      navigate("/kids")
  }

  return (
    <>
        <header>
            <div className="header-kid" onClick={openKids}>
                <img className="header-kid-image" src="/assets/profile-1.jpg" alt="profile-1.jpg"/>
                <h2 className="header-kid-name">Paulius</h2>
            </div>
            <HiBars3 className='bars' onClick={openKids}/>
        </header>
    </>
  )
}
