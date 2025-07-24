import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, RegisterData, LoginData } from '../types';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('Loading user...');
      // Listen to auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log('Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
        
        if (firebaseUser) {
          // User is signed in
          console.log('Firebase user:', firebaseUser.uid);
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log('Setting user from storage:', parsedUser);
            setUser(parsedUser);
          } else {
            console.log('No user data in storage');
          }
        } else {
          // User is signed out
          console.log('User signed out, clearing user state');
          setUser(null);
        }
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading user:', error);
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Password tidak cocok');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Don't set user data immediately after registration
      // User needs to login first
      console.log('Registration successful for:', data.email);
      
      // Sign out to force login
      await auth.signOut();
      setUser(null);
      await AsyncStorage.removeItem('user');
      
      return true;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mendaftar';
      throw new Error(errorMessage);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Create user data for login
      const newUserData: User = {
        id: firebaseUser.uid,
        username: data.email.split('@')[0], // Use email prefix as username
        email: data.email,
        uid: firebaseUser.uid
      };
      
      console.log('Login successful for:', data.email);
      setUser(newUserData);
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
      
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal login';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 