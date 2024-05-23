import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import Header from "./Header";
import { motion } from "framer-motion";
import SongCard from "./SongCard";

const Home = () => {
  const [
    {
      searchTerm,
      isSongPlaying,
      song,
      allSongs,

    },
    dispatch,
  ] = useStateValue();


  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }
  }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />

      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
        <HomeSongContainer data={allSongs} />
      </div>
    </div>
  );
};

export const HomeSongContainer = (({ data }) => {
  return (
    <div className=' w-full flex flex-wrap gap-3 items-center justify-evenly'>
      {data && data.map((song, index) =>
        <SongCard key={song._id} data={song} index={index} type="song"/>)}
    </div>
  )
});

export default Home;