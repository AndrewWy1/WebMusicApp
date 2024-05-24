import React, { useState } from 'react';
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';
import { deleteAlbumById, deleteArtistById, deleteSongById, getAllAlbums, getAllArtists, getAllSongs } from '../api';
import { motion } from 'framer-motion';
import { IoTrash } from 'react-icons/io5';

const Card = ({ data, index, type }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const [{ allSongs, allArtists, allAlbums, songIndex, isSongPlaying }, dispatch] = useStateValue();


  const deleteData = (data) => {
    switch (type) {
      case "song": {
        deleteSongById(data._id).then((res) => {
          getAllSongs().then((data) => {
            dispatch({
              type: actionType.SET_ALL_SONGS,
              allSongs: data.data,
            });
          });
        });

        break;
      }
      case "album": {
        deleteAlbumById(data._id).then((res) => {
          getAllAlbums().then((data) => {
            dispatch({
              type: actionType.SET_ALL_ALBUMS,
              allAlbums: data.data,
            });
          });
        });

        break;
      }
      case "artist": {
        deleteArtistById(data._id).then((res) => {
          getAllArtists().then((data) => {
            dispatch({
              type: actionType.SET_ALL_ARTISTS,
              allArtists: data.data,
            });
          });
        });

        break;
      }
      default: {
        break;
      }
    }
  };
  const addToContext = () => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if(songIndex !== index){
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  }
  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={type === "song" && addToContext}
      className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md 
      rounded-lg flex flex-col items-center"
    >
      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="absolute z-10 p-2 inset-0 bg-card backdrop-blur-md flex flex-col gap-6 items-center justify-center"
        >
          <p className="text-sm text-center text-textColor font-semibold">
            Are you sure do you want to delete this song?
          </p>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.7 }}
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-teal-400"
              onClick={() => deleteData(data)}
            >
              Yes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.7 }}
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              No
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          alt=""
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="text-base text-headingColor font-semibold my-2">
        {data.name.length > 20 ? `${data.name.slice(0, 20)}...` : data.name}
        {data.artist && (
          <span className="block text-sm text-gray-400 my-1">
            {data.artist.length > 20 ? `${data.artist.slice(0, 20)}...` : data.artist}
          </span>
        )}
      </p>

      <div className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4">
        <motion.i whileTap={{ scale: 0.75 }} onClick={() => setIsDeleted(true)}>
          <IoTrash className="text-base text-red-400 drop-shadow-md hover:text-red-600" />
        </motion.i>
      </div>
    </motion.div>
  );
};

export default Card;