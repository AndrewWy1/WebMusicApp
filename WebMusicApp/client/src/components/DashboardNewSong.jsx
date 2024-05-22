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
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import FilterButton from "./FilterButton";
import { genreFilters } from "../utils/supportFunctions";

const DashboardNewSong = () => {

  const [songName, setSongName] = useState("")
  const [songPictureCover, setSongPictureCover] = useState(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);

  const [{ allArtists, allAlbums }, dispatch] = useStateValue();


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
    if(isImage){
      setIsImageLoading(true);
    }
    const deletRef = ref(storage, url);
    deleteObject(deletRef).then(() => {
      setSongPictureCover(null);
      setIsImageLoading(false);
    });
  }

  return (
    <div className='flex flex-col  items-center justify-center p-4 border border-gray-300 rounded gap-4'>
      <input type="text" placeholder="Type the song: "
        className="w-full p-2 rounded-md text-base font-semibold text-textColor outline-none shadow-sm
       border border-gray-300 bg-transparent"
        onChange={(event) => setSongName(event.target.value)} />

      <div className=" w-full flex flex-wrap items-center justify-between gap-4">
        <FilterButton filterData={allArtists} flag={"Artists"} />
        <FilterButton filterData={allAlbums} flag={"Albums"} />
        <FilterButton filterData={genreFilters} flag={"Genres"} />
      </div>

      <div className="w-full flex items-center justify-between gap-2  flex-wrap">
        <div className=" w-full bg-card  backdrop-blur-md  w-min-[300px] h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isImageLoading && <PictureLoader progress={uploadProgress} />}
          {!isImageLoading && (
            <>
              {!songPictureCover ? (
                <FileUploader
                  updateState={setSongPictureCover}
                  // setAlert={setSetAlert}
                  // alertMsg={setAlertMsg}
                  isLoading={setIsImageLoading}
                  setProgress={setUploadProgress}
                  IsPicture={true}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img src={songPictureCover}
                    alt="uploaded image"
                    className="w-full h-full object-cover"/>

                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {deleteFile(songPictureCover, true);}}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* <div className="bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isAudioLoading && <PictureLoader progress={uploadProgress} />}
          {!isAudioLoading && (
            <>
              {!audioAsset ? (
                <FileUploader
                  setImageURL={setAudioAsset}
                  setAlert={setSetAlert}
                  alertMsg={setAlertMsg}
                  isLoading={setIsAudioLoading}
                  setProgress={setUploadProgress}
                  IsPicture={false}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                  <audio ref={audioRef} src={audioAsset} controls />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteImageObject(audioAsset, "audio");
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div> */}

        {/* <div className="flex items-center justify-end w-full p-4">
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
        </div> */}
      </div>
    </div>
  )
}

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
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateState(downloadURL);
          isLoading(false);
        })
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

export default DashboardNewSong;