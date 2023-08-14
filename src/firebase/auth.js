import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase-config';
import { createUserInFirestore } from './firestore';

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await createUserInFirestore(userCredential.user.uid);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: 'Password reset email sent!' };
  } catch (error) {
    return { error: error.message };
  }
};
