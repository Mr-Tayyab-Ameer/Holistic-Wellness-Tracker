import { createContext, useEffect, useState } from "react";


export const AppContext = createContext();


const AppContextProvider = (props) => {

  const [userData, setUserData] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const backendUrl = "http://localhost:5000";


    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        
        setIsLoggedIn(token);
      }, []);

      const value = {
        isLoggedIn,
        backendUrl,
        userData, setUserData,
      }

      return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
      );

}

export default AppContextProvider;



