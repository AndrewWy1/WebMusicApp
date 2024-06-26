import React, { useEffect } from 'react'
import { useStateValue } from "../context/StateProvider";
import { getAllAlbums, getAllArtists, getAllSongs, getAllUsers } from "../api";
import { actionType } from "../context/reducer";
import { FaUsers } from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";
import { GiLoveSong, GiMusicalNotes } from "react-icons/gi";

export const DashboardCard = ({ icon, name, count }) => {



  return (
    <div
      className='p-4 w-40 gap-3 h-auto bg-secondColor rounded-lg shadow-md flex flex-col items-center justify-center '>
      {icon}
      <p className='text-xl text-textColor font-semibold'>{name}</p>
      <p className='text-xl text-textColor'>{count}</p>

    </div>
  )
}

const DashboardHome = () => {

  const [{ allUsers, allSongs, allArtists, allAlbums }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data.data,
        });
      });
    }
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }

    if (!allArtists) {
      getAllArtists().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data.data,
        });
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data.data,
        })
      });
    }
  }, [])

  return (
    <div className="w-full h-screen p-6 flex items-start justify-evenly flex-wrap bg-thirdColor">
      <DashboardCard icon={<FaUsers className="text-3xl text-textColor" />} name={"Users"} count={allUsers?.length > 0 ? allUsers?.length : 0} />
      <DashboardCard icon={<GiLoveSong className="text-3xl text-textColor" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0} />
      <DashboardCard icon={<RiUserStarFill className="text-3xl text-textColor" />} name={"Artist"} count={allArtists?.length > 0 ? allArtists?.length : 0} />
      <DashboardCard icon={<GiMusicalNotes className="text-3xl text-textColor" />} name={"Album"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
    </div>
  )
}

export default DashboardHome;