import React, { useRef, useState, useEffect } from 'react';

const TakeImg = ({ onImageCaptured, token }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    initCamera();

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    const img = canvas.toDataURL('image/png');
    setImage(img);
    
    if (onImageCaptured && typeof onImageCaptured === 'function') {
      onImageCaptured(img); // Pass the captured image to the parent component
    }
  };

  const handleCapturePhoto = async (img) => {
    const blob = await (await fetch(img)).blob(); // Convert the data URL to a blob
    const formData = new FormData();
    formData.append('photo', blob, 'captured-image.png'); // Name the file as needed

    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is provided
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Photo captured successfully:', data);
      } else {
        console.error('Error capturing photo:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '300px' }} />
      <button onClick={captureImage}>Capture Image</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {image && <img src={image} alt="Captured" style={{ width: '300px' }} />}
    </div>
  );
};

export default TakeImg;
