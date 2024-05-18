import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FaCrown } from 'react-icons/fa';
import { app } from "../config/firebase.cofig";
import { getAuth } from "firebase/auth";
import { activeStyles, notActiveStyles } from "../utils/styles"
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
        <header className='flex items-center w-full p-4 md:py-2 md:px-6'>
            <NavLink to={"/"}>
                <img src={Logo} alt='Logo' className='w-16' />
            </NavLink>
            <ul className="flex items-center justify-center ml-7">
                <li className='mx-5 text-lg'><NavLink to={"./home"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Home</NavLink></li>
                <li className='mx-5 text-lg'><NavLink to={"./musics"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Musics</NavLink></li>
                <li className='mx-5 text-lg'><NavLink to={"./premium"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Premium</NavLink></li>
                <li className='mx-5 text-lg'><NavLink to={"./contact"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Contact Us</NavLink></li>
            </ul>

            <div
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}

                className='flex items-center ml-auto cursor-pointer gap-2 relative'>
                <img src={user?.user?.imageURL} className='w-12 h-12 backdrop:min-w-[44px] object-cover rounded-full shadow-lg' alt="" referrerPolicy='no-referrer' />
                <div className='flex flex-col'>
                    <p className='text-textColor text-lg hover:text-headingColor font-semibold'>{user?.user?.name}</p>
                    <p className='flex items-center gap-2 text-xs text-gray-500 font-normal'>Premium Member<FaCrown className='text-sm -ml-1 text-yellow-500' /></p>
                </div>

                {isMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className='absolute z-10 top-12 right-0 w-250 gap-1 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col'>
                        <NavLink to={"/userProfile"}>
                            <p className='text-base text-text   Color p-1 rounded-lg hover:text-white hover:font-semibold hover:bg-cyan-500 duration-150 transition-all ease-in-out '>Profile</p>
                        </NavLink>
                        <NavLink to={"/favourites"}>
                            <p className='text-base text-textColor p-1 rounded-lg hover:text-white hover:font-semibold hover:bg-cyan-500 duration-150 transition-all ease-in-out '>My Favourites</p>
                        </NavLink>
                        <hr />


                        {
                            user?.user?.role === "admin" && (
                                <>
                                    <NavLink to={"/dashboard/home"}>
                                        <p className='text-base text-textColor p-1 rounded-lg hover:text-white hover:font-semibold hover:bg-cyan-500 duration-150 transition-all ease-in-out '>Dashboard</p>
                                    </NavLink>
                                    <hr />
                                </>
                            )
                        }

                        <p onClick={logOut} className='text-base text-textColor p-1 rounded-lg hover:text-white hover:font-semibold hover:bg-cyan-500 duration-150 transition-all ease-in-out '>Sing Out</p>
                    </motion.div>
                )}
            </div>
        </header>
    )
}

export default Header