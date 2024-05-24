import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer"
import { getAllSongs } from "../api/index";
import { Card } from "./index";

const DashboardSongs = () => {

  const [songFilter, setsongFilter] = useState("");
  const [isForcus, setIsForcus] = useState(false);

  const [{ allSongs }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then(data => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        })
      })
    }
  }, [])

  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
      <div className='w-full flex items-center justify-center gap-20'>
        <NavLink className='flex items-center justify-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-500
        hover:shadow-md cursor-pointer'
          to={"/dashboard/newSong"}>
          <IoAdd />
        </NavLink>

        <input type="text" placeholder='Search:' value={songFilter}
          className={`w-52 px-4 py-2 border ${isForcus ? "border-gray-500 shadow-md" : "border-gray-300"} 
          rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-white font-semibold`}
          onChange={(event) => setsongFilter(event.target.value)}
          onBlur={() => { setIsForcus(false) }}
          onFocus={() => setIsForcus(true)} />

        <i>
          <AiOutlineClear className=' text-3xl text-textColor cursor-pointer' />
        </i>
      </div>

      <div className='relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md'>
        <SongContainer data={allSongs} />
      </div>
    </div>
  )
};

export const SongContainer = (({ data }) => {
  return (
    <div className=' w-full flex flex-wrap gap-3 items-center justify-evenly'>
      {data && data.map((song, index) =>
        <Card key={song._id} data={song} index={index} type="song"/>)}
    </div>
  )
});

export default DashboardSongs;