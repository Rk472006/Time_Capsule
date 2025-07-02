import React, { useState, useRef } from "react";

import axios from "axios";
import "./create.css";
import toast from "react-hot-toast";
import Navbar from "../layouts/Navbar";
import { useParams } from "react-router-dom";

export default function Create() {
  const uid = useParams().uid;
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [openAt, setOpenAt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const toISOStringWithOffset = (localDateTimeStr) => {
  const local = new Date(localDateTimeStr);
  return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
};

  const getUIDByEmail = async (email) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_EXPRESS_API}/api/user/getUIDByEmail`,
        { email }
      );
      return response.data.uid;
    } catch (error) {
      console.error("Error fetching UID by email:", error);
      toast.error("Failed to fetch recipient UID. Please check the email.");
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_EXPRESS_API}/api/messages/upload`,
        formData
      );
      console.log("Image uploaded successfully:", response.data.url);
      return response.data.url;
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipientUID = await getUIDByEmail(to);
      if (!recipientUID) return;

      const uploadedImageUrl = await uploadImageToCloudinary();

      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/messages/create`, {
        from: uid,
        to: recipientUID,
        content,
        openAt: toISOStringWithOffset(openAt), 
        imageUrl: uploadedImageUrl,
      });

      toast.success("Message scheduled!");
      setTo("");
      setContent("");
      setOpenAt("");
      setImageFile(null);
      setImagePreview("");
      setImageUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      toast.error("Failed to schedule message");
      console.error(error);
    }
  };

  return (
    <div className="create-container">
      <Navbar uid={uid} />
      <div className="create-form">
        <h3 className="create-header">Create Messages</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Recipient Email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={openAt}
            onChange={(e) => setOpenAt(e.target.value)}
            required
          />
          <div className="create-image-upload">
            <label id="image-upload">Upload Image (optional):</label>
            <input
              name="image-upload"
              htmlFor="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>
          {imagePreview && (
            <div style={{ margin: "10px 0" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                  setImageUrl("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                  }
                }}
                style={{
                  marginTop: "8px",
                  background: "#ff4d4f",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Remove Image
              </button>
            </div>
          )}

          <button type="submit">Schedule Message</button>
        </form>
      </div>
    </div>
  );
}
