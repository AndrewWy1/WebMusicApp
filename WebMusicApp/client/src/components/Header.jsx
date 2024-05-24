import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FaCrown } from 'react-icons/fa';
import { app } from "../config/firebase.cofig";
import { getAuth } from "firebase/auth";
import { Logo } from "../assets/img/index";
import { useStateValue } from "../context/StateProvider";
import { motion } from "framer-motion";

const Header = () => {

    const [{ user }, dispatch] = useStateValue();
    const [isMenu, setIsMenu] = useState(false);

    const navigate = useNavigate();

    const logOut = () => {
        const firebaseAuth = getAuth(app);
        firebaseAuth.signOut().then(() => {
            window.localStorage.setItem("auth", "false");
        }).catch((error) => console.log(error));
        navigate("/login", { replace: true });
    }

    return (
        <header className='flex items-center w-full p-4 md:py-2 md:px-6 bg-fourthColor'>
            <NavLink to={"/"} className='self-center'>
                <img src={Logo} alt='Logo' className='w-24' />
            </NavLink>
            <div
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}

                className='flex items-center ml-auto cursor-pointer gap-2 relative' >
                <img src={user?.user?.imageURL} className='w-14 h-14 backdrop:min-w-[44px] object-cover rounded-full shadow-lg' alt="" referrerPolicy='no-referrer' />
                <div className='flex flex-col'>
                    <p className='text-textColor   text-lg hover:text-headingColor font-semibold'>{user?.user?.name}</p>
                    {user?.user?.role === "admin" && (
                        <p className='flex items-center gap-2 text-xs '>Admin <FaCrown className=' text-yellow-400' /></p>
                    )}

                </div>

                {isMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className='absolute z-10 top-12 right-0 w-250 gap-1 bg-thirdColor shadow-lg rounded-lg backdrop-blur-sm flex flex-col'>
                        {
                            user?.user?.role === "admin" && (
                                <>
                                    <NavLink to={"/dashboard/home"}>
                                    <p className='text-base text-textColor p-1 rounded-lg 
                                    hover:text-white hover:font-semibold hover:bg-secondColor duration-150 
                                    transition-all ease-in-out '>Dashboard</p>
                                </NavLink>
                                <hr />
                                </>
                            )
                        }

                        <p onClick={logOut} className='text-base text-textColor p-1 rounded-lg hover:text-white 
                        hover:font-semibold hover:bg-secondColor duration-150 transition-all ease-in-out '>Sing Out</p>
                    </motion.div>
                )}
            </div>
        </header>
    )
}

export default Header