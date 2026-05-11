import { useEffect, useRef, useState } from "react";

export default function ImageInput({ setImage }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      ("ontouchstart" in window && navigator.maxTouchPoints > 0);

    setIsMobile(mobile);
  }, []);

  return (
    <div>
      {/* Camera Input (Mobile Only) */}
      {isMobile && (
        <>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button onClick={() => cameraRef.current.click()}>
            📸 Take Photo
          </button>
        </>
      )}

      {/* Gallery / Upload Input (All Devices) */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={() => galleryRef.current.click()}>
        🖼 Upload Image
      </button>
    </div>
  );
}
