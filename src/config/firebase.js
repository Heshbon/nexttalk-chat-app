import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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

const signup = async (username,email,password) => {
try {
  const res = await createUserWithEmailAndPassword(auth,email,password);
  const user = res.user;
  await setDoc(doc(db,'users',user.uid),{
    id:user.uid,
    username:username.toLowerCase(),
    email,
    name:'',
    avatar:'',
    info:'Hey there! I am a new user on this chat app',
    lastSeen:Date.now()
  })
  await setDoc(db,'chats',user.uid),{
    chatData:[]
  }
} catch (error) {
  console.error(error)
  toast.error(error.code.split('/')[1].split('-').join(' '));
}
}

const login = async (email,password) => {
  try {
    await signInWithEmailAndPassword(auth,email,password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
 
}

export {signup,login,auth,logout,db}