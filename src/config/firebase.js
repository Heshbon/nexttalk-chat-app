import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCCHBA8X97i8_I3peDlwK5-WSYaTvGGwio",
  authDomain: "nexttalk-chat-app.firebaseapp.com",
  projectId: "nexttalk-chat-app",
  storageBucket: "nexttalk-chat-app.appspot.com",
  messagingSenderId: "274412322611",
  appId: "1:274412322611:web:61c632ad0eb6dba26ac846"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up a new user
const signup = async (username,email,password) => {
try {
  const usersRef = collection(db,'users');
  const q = query(usersRef, where('username', '==', username.toLowerCase()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length>0) {
    toast.error('Username not available');
    return;
  }
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user;

  await setDoc(doc(db,'users', user.uid), {
    id:user.uid,
    username:username.toLowerCase(),
    email,
    name:'',
    avatar:'',
    info:'Hey there! I am a new user on this chat app',
    lastSeen:Date.now()
  });

  // Create a chat document for the user
  await setDoc(doc(db, 'chats', user.uid), { chatsData:[] });
  toast.success('Account created successfully!');

} catch (error) {
  console.error(error)
  toast.error(error.code.split('/')[1].split('-').join(' '));
}
}

// Log in an existing user
const login = async (email,password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
};

// Log out the current user
const logout = async () => {
  signOut(auth)
}

// Reset password
const resetPass = async (email) => {
  if (!email) {
    toast.error('Enter your email address');
    return;
  }

  try {
    const userRef = collection(db, 'users')
    const q = query(userRef, where('email', email))
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email)
      toast.success('We have sent you a password reset email')
    }
  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
};

export {signup,login,auth,logout,db, resetPass};