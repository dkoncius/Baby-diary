import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../firebase/auth';
import { RxCross1 } from "react-icons/rx";

export const Nav = ({ user }) => {
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

  return (
    <nav className='kids-nav'>
      <p className='logout' onClick={handleSignOut}>
        Log Out
      </p>
      <div className="icon" onClick={() => navigate("/feed")}>
        <RxCross1/>
      </div>
    </nav>
  );
};
