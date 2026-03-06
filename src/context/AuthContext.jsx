import React, { createContext, useContext, useEffect, useState } from 'react';

const USERS_KEY = 'pinkroute_users';
const CURRENT_USER_KEY = 'pinkroute_current_user';

const AuthContext = createContext();

const getUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (_) {}
    }
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const stored = users[email?.toLowerCase()];
    if (!stored || stored.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const currentUser = {
      email: stored.email,
      displayName: stored.name,
      uid: stored.email,
      phone: stored.phone,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
    return { success: true };
  };

  const register = (name, email, password, phone = '') => {
    const users = getUsers();
    const key = email?.toLowerCase();
    if (users[key]) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    users[key] = { name, email: key, password, phone };
    saveUsers(users);
    const currentUser = {
      email: key,
      displayName: name,
      uid: key,
      phone,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
