import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login, Home, Dashboard, MusicPlayer } from './components';
import { app } from "./config/firebase.cofig";
import { getAuth, } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { validateUser } from './api';
import { useStateValue } from './context/StateProvider';
import { actionType } from "./context/reducer";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{ user, isSongPlaying }, dispatch] = useStateValue();


  const [auth, setAuth] = useState(false || window.localStorage.getItem("auth" === "true"));

  useEffect(() => {
    //setIsLoading(true);
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        userCred.getIdToken().then((token) => {
          console.log(token);
          //window.localStorage.setItem("auth", "true");
          validateUser(token).then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          });
        });
        //setIsLoading(false);
      } else {
        setAuth(false);
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
        //setIsLoading(false);
        window.localStorage.setItem("auth", "false");
        navigate("/login");
      }
    });
  }, []);

  return (
    <AnimatePresence mode='wait'>
      <div className="h-full min-w-[680px] text-blue-950 bg-thirdColor flex items-center justify-center">
        <Routes>
          <Route path='/login' element={<Login setAuth={setAuth} />} />
          <Route path='/' element={<Home />} />
          <Route path='/dashboard/*' element={<Dashboard />}></Route>
        </Routes>

        {isSongPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md 
            flex items-center justify-center`}
          >
            <MusicPlayer />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}

export default App