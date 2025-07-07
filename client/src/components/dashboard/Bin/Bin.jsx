import React, { useEffect, useState } from "react";
import axios from "axios";
import "./bin.css";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Navbar from "../layouts/Navbar"; 
import Bin_Msg from "./Bin_Msg"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../utils/firebase";  

export default function Bin({  }) {
   const [uid, setUid] = useState(null);
  const [messages, setMessages] = useState([]);
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);
        fetchMessages(currentUid); 
        console.log(currentUid);
      } else {
        toast.error("You must be logged in to view the Bin.");
        setUid(null);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);
  const fetchMessages = async () => {
    try {
      
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/messages/bin/${uid}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching bin messages:", err);
      toast.error("Error fetching bin messages:", err);
    }
  };

  useEffect(() => {
    
    if (uid) fetchMessages();
   
  }, [uid]);

  const handleRestore = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_EXPRESS_API}/api/messages/restore/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("Restore failed:", err);
      toast.error("Failed to restore message.");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_EXPRESS_API}/api/messages/permanent/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("Permanent delete failed:", err);
      toast.error("Failed to permanently delete message.");
    }
  };

  return (
  <div className="bin-container">
    <Navbar uid={uid}/>
    <div className="bin-page">
    <h3>🗑️ Bin</h3>
    {messages.length === 0 ? (
      <p>No deleted messages found.</p>
    ) : (
      messages.map((msg) => (
         <Bin_Msg
          key={msg._id}
          msg={msg}
          handleRestore={handleRestore}
          handlePermanentDelete={handlePermanentDelete}
        />
      ))
    )}
    </div>
  </div>
);

}
