import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

//import { storage } from "../config/firebase.config";
import { useStateValue } from "../context/StateProvider";
import {
  getAllAlbums,
  getAllArtists,
  getAllSongs,
  saveNewAlbum,
  saveNewArtist,
  saveNewSong,
} from "../api/index";
import { actionType } from "../context/reducer";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import FilterButton from "./FilterButton";
import {genreFilters} from "../utils/supportFunctions";

const DashboardNewSong = () => {

  const [songName, setSongName] = useState("")
  const [{allArtists, allAlbums}, dispatch] = useStateValue();


  useEffect(() => {
    if(!allArtists){
      getAllArtists().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data.data,
        });
      });
    }

    if(!allAlbums){
      getAllAlbums().then((data) => {
        dispatch({
          type : actionType.SET_ALL_ALBUMS,
          allAlbums: data.data,
        });
      });
    }
  }, []);

  return (
    <div className='flex flex-col  items-center justify-center p-4 border border-gray-300 rounded gap-4'>
       <input type="text" placeholder="Type the song: " 
       className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
       onChange={(event) => setSongName(event.target.value)}/>

      <div className=" w-full flex flex-wrap items-center justify-between gap-4">
        <FilterButton filterData={allArtists} flag={"Artists"} />
        <FilterButton filterData={allAlbums} flag={"Albums"} />
        <FilterButton filterData={genreFilters} flag={"Genres"} />
      </div>

    </div>
  )
}

export default DashboardNewSong;