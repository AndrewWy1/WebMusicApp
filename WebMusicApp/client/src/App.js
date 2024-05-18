import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login, Home } from './components';
import { app } from "./config/firebase.cofig";
import { getAuth, } from "firebase/auth";
import { AnimatePresence } from "framer-motion";
import { validateUser } from './api';
import { useStateValue } from './context/StateProvider';
import { actionType } from "./context/reducer";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();


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
      <div className="h-auto min-w-[680px] bg-primary flex items-center justify-center">
        <Routes>
          <Route path='/login' element={<Login setAuth={setAuth} />} />
          <Route path='/*' element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  )
}

export default App