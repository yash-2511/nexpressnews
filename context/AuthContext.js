import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebaseConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    if (!isFirebaseConfigured() || !auth) {
      // Use mock authentication when Firebase is not configured
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
      return;
    }
    
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      // Mock authentication
      const userData = {
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password, name) => {
    if (!isFirebaseConfigured() || !auth) {
      // Mock registration
      const userData = {
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (name && result.user) {
        await updateProfile(result.user, {
          displayName: name
        });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      return { 
        success: false, 
        error: 'Google Sign-In requires Firebase configuration. Please set up Firebase credentials in .env.local file.' 
      };
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    if (!isFirebaseConfigured() || !auth) {
      // Mock sign out
      setUser(null);
      localStorage.removeItem('user');
      return { success: true };
    }
    
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signInWithGoogle, signOut, mounted, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
