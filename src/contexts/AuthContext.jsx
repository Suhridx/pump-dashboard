import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptForStorage, decryptFromStorage } from '../utilities/Encryption'

// --- 1. Define Predefined Users ---
// As requested, user data is stored in a simple object.
const PREDEFINED_USERS = {
  'Itfoa': { password: 'Iratower@12345', name: 'Residents', role: 'USER' },
  'Suhrid': { password: 'Suhrid@pump1', name: 'Suhrid', role: 'OWNER' },
  'Pushpal': { password: 'Pushpal@12345', name: 'Pushpal', role: 'OWNER' },
  'Itfoa_admin': { password: 'Itfoa@admin12345!', name: 'Iratower Admin', role: 'ADMIN' },
};

// --- 2. Create the Context ---
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- 3. Create the Provider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On initial load, check localStorage to see if a user is already logged in.
  useEffect(() => {
    try {
      const key = import.meta.env.REACT_APP_STORAGE_KEY || "fallback_key";
      const storedUser = localStorage.getItem('app_user');
      const user = JSON.parse(decryptFromStorage(storedUser, key))
      if (user) {
        // console.log(user);

        setUser(user);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('app_user');
    }
  }, []);

  /**
   * Logs in the user by checking credentials against the predefined list.
   * @param {string} userId - The user's ID/username.
   * @param {string} password - The user's password.
   * @returns {boolean} - True for successful login, false for failure.
   */
  const login = (userId, password, validity) => {
//  console.log("validity value" + validity);
 

    const foundUser = PREDEFINED_USERS[userId];

    if (foundUser && foundUser.password === password) {
      const userData = { id: userId, role: foundUser.role, name: foundUser.name, timeStamp: Date.now() };
      const key = import.meta.env.REACT_APP_STORAGE_KEY || "fallback_key";
      if (validity)
        localStorage.setItem('app_user', encryptForStorage(JSON.stringify(userData), key));
      setUser(userData);
      navigate('/'); // Redirect to the main page after login
      return true;
    }

    // If login fails
    console.warn('Login failed: Invalid credentials');
    return false;
  };

  /**
   * Logs out the current user.
   */
  const logout = () => {
    localStorage.removeItem('app_user');
    setUser(null);
    navigate('/login'); // Redirect to the login page after logout
  };

  // The value provided to consuming components
  const value = {
    user,
    isAuthenticated: !!user, // `!!user` converts the user object to a boolean
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 4. Create a Custom Hook for easier use ---

