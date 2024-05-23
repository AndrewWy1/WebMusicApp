import axios from "axios";

const baseURL = "http://localhost:4000/";

export const validateUser = async (token) => {
    try {
        const res = axios.get(`${baseURL}api/users/login`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return (await res).data;
    }
    catch (error) { };
};

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}api/users/getAll`);
        return res.data;
    }
    catch (error) {
        return null;
    }
}

export const getAllArtists = async () => {
    try {
        const res = await axios.get(`${baseURL}api/artists/getAll`);
        return res.data;
    } catch (error) {
        return null;
    }
};

export const getAllSongs = async () => {
    try {
        const res = await axios.get(`${baseURL}api/songs/getAll`);
        return res.data;
    } catch (error) {
        return null;
    }
};

export const getAllAlbums = async () => {
    try {
        const res = await axios.get(`${baseURL}api/albums/getAll`);
        return res.data;
    } catch (error) {
        return null;
    }
};

export const changinUserRole = async (userId, role) => {
    try {
        const res = axios.put(`${baseURL}api/users/updateRole/${userId}`, { data: { role: role } })
        return res;
    }
    catch (error) {
        return null;
    }
}

export const removeUser = async (userId) => {
    try {
        const res = axios.delete(`${baseURL}api/users/deleteUser/${userId}`)
        return res;
    }
    catch (error) {
        return null;
    }
}

export const deleteSongById = async (id) => {
    try {
        const res = axios.delete(`${baseURL}api/songs/delete/${id}`);
        return res;
    }
    catch (error) {
        return null;
    }
};

export const saveNewSong = async data => {
    try {
        const res = axios.post(`${baseURL}api/songs/set`, { ...data });
        return (await res).data.savedSong;
    } 
    catch (error) {
        return null;
    }
}

export const saveNewArtist = async data => {
    try {
        const res = axios.post(`${baseURL}api/artists/set`, { ...data });
        return (await res).data.savedArtist;
    } 
    catch (error) {
        return null;
    }
}

export const saveNewAlbum = async data => {
    try {
        const res = axios.post(`${baseURL}api/albums/set`, { ...data });
        return (await res).data.savedAlbum;
    } 
    catch (error) {
        return null;
    }
}