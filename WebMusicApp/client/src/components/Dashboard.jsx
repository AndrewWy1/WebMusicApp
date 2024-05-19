import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { IoHome } from "react-icons/io5";

import Header from './Header';
import { activeStyles, notActiveStyles } from '../utils/styles';
import DashboardHome from "./DashboardHome";
import DashboardUsers from "./DashboardUsers";
import DashboardSongs from "./DashboardSongs";
import DashboardArtists from "./DashboardArtists";
import DashboardAlbums from "./DashboardAlbums";



const Dashboard = () => {
    return (
        <div className=' w-full h-auto flex flex-col items-center justify-center bg-primary'>
            <Header />

            <div className='w-[60%] my-2 p-4 flex items-center justify-evenly'>
                <NavLink to={"/dashboard/home"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}><IoHome className='text-2xl text-textColor' /></NavLink>
                <NavLink to={"/dashboard/user"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Users</NavLink>
                <NavLink to={"/dashboard/songs"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Songs</NavLink>
                <NavLink to={"/dashboard/artists"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Artist</NavLink>
                <NavLink to={"/dashboard/albums"} className={({ isActive }) => isActive ? activeStyles : notActiveStyles}>Albums</NavLink>
            </div>

            <div className='my-4 w-full p-4'>
                <Routes>
                    <Route path='/home' element={<DashboardHome/>}/>
                    <Route path='/user' element={<DashboardUsers/>}/>
                    <Route path='/songs' element={<DashboardSongs/>}/>
                    <Route path='/artists' element={<DashboardArtists/>}/>
                    <Route path='/albums' element={<DashboardAlbums/>}/>
                    <Route path='/newSong' element={<DashboardHome/>}/>
                </Routes>
            </div>

        </div>
    )
}

export default Dashboard