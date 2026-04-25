import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, token }
  const [loading, setLoading] = useState(true);

  // Restore persisted user on app launch
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const name  = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const id    = await AsyncStorage.getItem('userId');
        if (token && name && email && id) {
          setUser({ token, name, email, id });
        }
      } catch (e) {
        console.warn('Failed to load auth data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ token, name, email, id }) => {
    await AsyncStorage.multiSet([
      ['token', token],
      ['userName', name],
      ['userEmail', email],
      ['userId', id]
    ]);
    setUser({ token, name, email, id });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'userName', 'userEmail', 'userId']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
