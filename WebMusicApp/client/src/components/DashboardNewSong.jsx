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

import { storage } from "../config/firebase.cofig";
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
import FilterButton from "./FilterButton";
import { genreFilters } from "../utils/supportFunctions";

const DashboardNewSong = () => {

  const [songName, setSongName] = useState("");
  const [songPictureCover, setSongPictureCover] = useState(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioPictureCover, setAudioPictureCover] = useState(null);
  const [audioUploadingProgress, setAudioUploadingProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistUploadingProgress, setArtistUploadingProgress] = useState(0);
  const [isArtistUploading, setIsArtistUploading] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [x, setX] = useState("");
  const [instagram, setInstagram] = useState("");

  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumUploadingProgress, setAlbumUploadingProgress] = useState(0);
  const [isAlbumUploading, setIsAlbumUploading] = useState(false);
  const [albumName, setAlbumName] = useState("")

  const [{ allSongs, allArtists, allAlbums, artistFilter, genreFilter, albumFilter, }, dispatch] = useStateValue();


  useEffect(() => {
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
        });
      });
    }
  }, []);

  const deleteFile = (url, isImage) => {
    if (isImage) {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      setIsAlbumUploading(true)
      setIsArtistUploading(true);

    }
    const deletRef = ref(storage, url);
    deleteObject(deletRef).then(() => {


      setSongPictureCover(null);
      setAudioPictureCover(null);
      setAlbumImageCover(null);
      setArtistImageCover(null);

      setIsImageLoading(false);
      setIsAudioLoading(false);
      setIsAlbumUploading(false)
      setIsArtistUploading(false);
    });
  }

  const saveSong = () => {
    if (!songPictureCover || !audioPictureCover) {


    }
    else {
      setIsImageLoading(true);
      setIsAudioLoading(true);

      const data = {
        name: songName,
        imageURL: songPictureCover,
        songURL: audioPictureCover,
        album: albumFilter,
        artist: artistFilter,
        genre: genreFilter,
      };

      saveNewSong(data).then((res) => {
        getAllSongs().then((songs) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: songs.data
          });
        });
      });

      setIsImageLoading(false);
      setIsAudioLoading(false);
      setSongName("");
      setSongPictureCover(null);
      setAudioPictureCover(null);
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
      dispatch({ type: actionType.SET_GENRE_FILTER, genreFilter: null });
      // setDuration(null);
    };
  };

  const saveArtist = () => {
    if (!artistImageCover || !artistName || !x || !instagram) {

    }
    else {
      setIsArtistUploading(true);
      const data = {
        name: artistName,
        imageURL: artistImageCover,
        X: x,
        instagram: instagram,
      }

      saveNewArtist(data).then((res) => {
        getAllArtists().then((artists) => {
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: artists.data
          });
        });
      });

      setIsArtistUploading(false);
      setArtistImageCover(null);
      setX("")
      setInstagram("");
      setArtistName("");
    }
  }

  const saveAlbum = () => {
    if (!albumImageCover || !albumName) {

    }
    else {
      setIsAlbumUploading(true);

      const data = {
        name: albumName,
        imageURL: albumImageCover,
      }
      saveNewAlbum(data).then((res) => {
        getAllAlbums().then((album) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: album.data
          });
        });
      });


      setIsAlbumUploading(false);
      setAlbumImageCover(null);
      setAlbumName("");
    }
  }

  return (
    <div className='flex flex-col w-880 items-center justify-center p-4 border border-gray-300 rounded gap-4'>
      <input type="text" placeholder="Type the song: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        onChange={(event) => setSongName(event.target.value)}
        value={songName} />

      <div className=" w-full flex flex-wrap items-center justify-between gap-4">
        <FilterButton filterData={allArtists} flag={"Artists"} />
        <FilterButton filterData={allAlbums} flag={"Albums"} />
        <FilterButton filterData={genreFilters} flag={"Genres"} />
      </div>


      <div className=" w-full bg-card  backdrop-blur-md  w-min-[300px] h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isImageLoading && <PictureLoader progress={uploadProgress} />}
        {!isImageLoading && (
          <>
            {!songPictureCover ? (
              <FileUploader
                updateState={setSongPictureCover}
                isLoading={setIsImageLoading}
                setProgress={setUploadProgress}
                IsPicture={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img src={songPictureCover}
                  alt="uploaded image"
                  className="w-full h-full object-cover" />

                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => { deleteFile(songPictureCover, true); }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className=" w-full bg-card  backdrop-blur-md  w-min-[300px] h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAudioLoading && <PictureLoader progress={audioUploadingProgress} />}
        {!isAudioLoading && (
          <>
            {!audioPictureCover ? (
              <FileUploader
                updateState={setAudioPictureCover}
                isLoading={setIsAudioLoading}
                setProgress={setAudioUploadingProgress}
                IsPicture={false}
              />
            ) : (
              <div className="relative w-full h-full  flex items-center justify-center overflow-hidden rounded-md">
                <audio src={audioPictureCover} controls></audio>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => { deleteFile(audioPictureCover, false); }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-end w-full p-4">
        {isImageLoading || isAudioLoading ? (
          <DisabledButton />
        ) : (
          <motion.button
            whileTap={{ scale: 0.75 }}
            className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
            onClick={saveSong}
          >
            Send
          </motion.button>
        )}
      </div>


      <p className=" text-xl font-semibold text-headingColor">Artist Details</p>
      <div className=" w-full bg-card  backdrop-blur-md  w-min-[300px] h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtistUploading && <PictureLoader progress={artistUploadingProgress} />}
        {!isArtistUploading && (
          <>
            {!artistImageCover ? (
              <FileUploader
                updateState={setArtistImageCover}
                isLoading={setIsArtistUploading}
                setProgress={setArtistUploadingProgress}
                IsPicture={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img src={artistImageCover}
                  alt="uploaded image"
                  className="w-full h-full object-cover" />

                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => { deleteFile(artistImageCover, true); }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <input type="text" placeholder="Type the artist: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        value={artistName}
        onChange={(event) => setArtistName(event.target.value)} />

      <input type="text" placeholder="Type the X: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        value={x}
        onChange={(event) => setX(event.target.value)} />

      <input type="text" placeholder="Type the Instagram: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        value={instagram}
        onChange={(event) => setInstagram(event.target.value)} />

      <div className="flex items-center justify-end w-full p-4">
        {isArtistUploading ? (
          <DisabledButton />
        ) : (
          <motion.button
            whileTap={{ scale: 0.75 }}
            className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
            onClick={saveArtist}
          >
            Send
          </motion.button>
        )}
      </div>


      <p className=" text-xl font-semibold text-headingColor">Album Details</p>
      <div className=" w-full bg-card  backdrop-blur-md  w-min-[300px] h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAlbumUploading && <PictureLoader progress={albumUploadingProgress} />}
        {!isAlbumUploading && (
          <>
            {!albumImageCover ? (
              <FileUploader
                updateState={setAlbumImageCover}
                isLoading={setIsAlbumUploading}
                setProgress={setAlbumUploadingProgress}
                IsPicture={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img src={albumImageCover}
                  alt="uploaded image"
                  className="w-full h-full object-cover" />

                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => { deleteFile(albumImageCover, true); }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <input type="text" placeholder="Type the album: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        value={albumName}
        onChange={(event) => setAlbumName(event.target.value)} />

      <div className="flex items-center justify-end w-full p-4">
        {isAlbumUploading ? (
          <DisabledButton />
        ) : (
          <motion.button
            whileTap={{ scale: 0.75 }}
            className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
            onClick={saveAlbum}
          >
            Send
          </motion.button>
        )}
      </div>
    </div >
  );
};

export const PictureLoader = ({ progress }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}`}</>}
      </p>
      <div className="w-20 h-20 min-with-[40px] bg-red-600 animate-ping rounded-full flex items-center 
      justify-center relative">
        <div className=" absolute inset-0 rounded-full bg-red-600 blur-xl"></div>
      </div>
    </div>
  );
};

export const FileUploader = ({ updateState, isLoading, setProgress, IsPicture }) => {
  const uploadFile = (event) => {
    isLoading(true);
    const uploadedFile = event.target.files[0];
    const storageRef = ref(storage, `${IsPicture ? "images" : "audio"}/${Date.now()}-${uploadedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);

    uploadTask.on("state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateState(downloadURL);
          isLoading(false);
        });
      }
    );
  }

  return <label>
    <div className="flex flex-col items-center justify-center h-full">
      <div className=" flex flex-col justify-center items-center cursor-pointer">
        <p className="font-bold text-2xl">
          <BiCloudUpload />
        </p>
        <p className="text-lg">
          Click to upload {IsPicture ? "an picture" : "an audio"}
        </p>
      </div>
    </div>
    <input className='w-0 h-0'
      type="file" name="upload-file" accept={`${IsPicture ? "image/*" : "audio/*"}`}
      onChange={uploadFile} />
  </label>
}

export const DisabledButton = () => {
  return (
    <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 
    dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin"
        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
        50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094
         90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 
        15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 
        41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
        9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 
        82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor" />
      </svg>
      Loading...
    </button>
  )
}

export default DashboardNewSong;