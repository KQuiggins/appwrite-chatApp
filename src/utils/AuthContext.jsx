import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwrite.Config";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
     getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try {
      const response = await account.createEmailSession(
        credentials.email,
        credentials.password,
      );

      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserLogOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);

    } catch (error) {
      console.error(error);
    }
  };

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords do not match");
      return;
    }

    try {
        let response = await account.create(
            ID.unique(),
            credentials.email,
            credentials.password1,
            credentials.name,
        );
        
        await account.createEmailSession(credentials.email, credentials.password1)
        let accountDetails = await account.get();
        setUser(accountDetails);
        navigate("/");

    } catch (error) {
        console.error(error);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogOut,
    handleUserRegister,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
