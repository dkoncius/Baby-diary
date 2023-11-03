import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemoriesForKid } from '../components/redux/userThunks';
import { getFirestore, doc, collection, query, getDocs, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FeedHeader } from '../components/feed/FeedHeader';
import {FeedImageGallery} from '../components/feed/FeedImageGallery';



const FeedPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kidData, setKidData] = useState(null);
  const location = useLocation();

  // Fetch the user from Redux store
  const user = useSelector(state => state.user);

  const fetchMemories = async (kidId) => {
    const db = getFirestore();
    const currentUser = getAuth().currentUser;
   

    const userRef = doc(db, 'users', currentUser.uid);
    const kidRef = doc(userRef, 'kids', kidId);
    console.log("Kids User:", kidRef);
    const memoryRef = collection(kidRef, 'memories');

    const memoryDocs = await getDocs(memoryRef);

    if (!memoryDocs.empty) {
      const memoriesData = memoryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMemories(memoriesData);
    } else {
      console.log('No memories found for the kid');
    }
  };

  const fetchFirstKid = async () => {
    try {
      if (!user) return;
      const db = getFirestore();
      const currentUser = getAuth().currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      const kidsRef = collection(userRef, 'kids');
      const kidsQuery = query(kidsRef, limit(1));
      const kidDocs = await getDocs(kidsQuery);

      if (!kidDocs.empty) {
        const firstKidData = { id: kidDocs.docs[0].id, ...kidDocs.docs[0].data() };
        setKidData(firstKidData);
        fetchMemories(firstKidData.id);
      } else {
        console.log('No kids data found');
      }
    } catch (error) {
      console.error('Error fetching first kid: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.kidToFeed) {
        setKidData(location.state.kidToFeed);
        const memoriesData = await fetchMemoriesForKid(user.uid, location.state.kidToFeed.id);
        setMemories(memoriesData);
        setLoading(false);
      } else {
        fetchFirstKid();
      }
    };
    fetchData();
  }, [user, location.state]);
  

  const hasMemories = memories && memories.length > 0;

  return (
<main className="feed-page" style={hasMemories ? { display: "block" } : { display: "flex"}}>
    {!loading && <FeedHeader kidData={kidData}/>}

        {hasMemories ? (
          <>
            <div className="metrics">
              <h2>Mėnesio pokyčiai </h2>
              <div className="metrics-grid">
                <div className="metric-box">
                  <p>ŪGIS</p>
                  <div className="data"></div>
                </div>
                <div className="metric-box">
                  <p>SVORIS</p>
                  <div className="data"></div>
                </div>
                <div className="metric-box">
                  <p>NUOTAIKA</p>
                  <div className="data"></div>
                </div>
              </div>
            </div>

            <div className="feed">
              <h2>Prisiminimai</h2>
              <FeedImageGallery memories={memories} />
            </div>
          </>
        ) : (
          <div className="no-memories-msg">
            <p>Pridėkite pirmą vaiko prisiminimą :)</p>
            <img src="assets/arrow-to-memory-button.svg" alt="" />
          </div>
         
        )}

        <footer>
          <div className="container">
            <a className='copy'>2023 © Kūdikio dienoraštis</a>
            <div className="social">
              <a href="#"><i className="fa-brands fa-facebook"></i></a>
              <a href="#"><i className="fa-brands fa-spotify"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </footer>
    </main>
  );
};

export default FeedPage;
