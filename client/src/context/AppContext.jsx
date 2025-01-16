import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;     //sending cookies


    // Ensure no trailing slash and trim whitespace from `VITE_BACKEND_URL`
    const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, '');

    // State variables
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Use `null` for better semantics when no data exists

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
        }catch(error){
            toast.error(error.message)
        }
    }



    // Function to fetch user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                withCredentials: true, // Ensure cookies are sent if required
            });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message || "Failed to fetch user data.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while fetching user data.");
        }
    };


    useEffect(()=>{
        getAuthState();
    },[])

    // Value provided to the context consumers
    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
