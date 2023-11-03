import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../firebase/auth';
import { RxCross1 } from "react-icons/rx";

export const KidsNav = ({ user, kidData }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out: ', error);
    } finally {
      navigate('/login');
    }
  };

  const goBackToFeed = () => {
    return navigate('/feed', { state: { kidToFeed: kidData} });
  }
  

  return (
    <nav className='kids-nav'>
      <p className='logout' onClick={handleSignOut}>
        Log Out
      </p>
      <div className="icon" onClick={goBackToFeed}>
        <RxCross1/>
      </div>
    </nav>
  );
};
