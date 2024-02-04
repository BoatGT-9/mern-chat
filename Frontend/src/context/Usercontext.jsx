// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const UserContext = createContext();
// export const UserContextProvider = ({ children }) => {
//   const [username, setUsername] = useState(null);
//   const [id, setId] = useState(null);
//   useEffect(() => {
//     axios.get("/profile").then((response) => {
//       setId(response.data.userId);
//       setUsername(response.data.username);
//     });
//   }, []);
//   return (
//     <UserContext.Provider value={{ username, setUsername, id, setId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
//     axios.get("/profile", { withCredentials: true }).then((response) => {
//   setId(response.data.userId);
//   setUsername(response.data.username);
// });
  }, []);
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};