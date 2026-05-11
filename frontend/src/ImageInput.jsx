import { useEffect, useRef, useState } from "react";

export default function ImageInput({ setImage }) {
  const camRef = useRef(null);
  const fileRef = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    setMobile(
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setUploaded(true);
  };

  return (
    <>

      {mobile && (
          <>
            <div className={`upload-box ${uploaded ? "uploaded" : ""}`}>
                <input
                    ref={camRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={(e) => handleImage(e.target.files[0])}
                />
                <button onClick={() => camRef.current.click()}>
                    📸 Take Photo
                </button>
            </div>
        </>
      )}

    <div className={`upload-box ${uploaded ? "uploaded" : ""}`}>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleImage(e.target.files[0])}
      />

      <p onClick={() => fileRef.current.click()}>
        {uploaded ? "✅ Image Uploaded" : "⬆ Click or tap to upload an image"}
      </p>
    </div>
    </>
  );
}
