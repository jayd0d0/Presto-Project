import React from 'react';
const PreviewVideos = ({ videoObjects }) => {
  return (
    <>
      {videoObjects.map((videoObject, index) => (
        <iframe
          key={index}
          src={
            videoObject.autoPlay
              ? `${videoObject.videoUrl}&autoplay=1`
              : `${videoObject.videoUrl}`
          }
          style={{
            position: 'absolute',
            width: `${videoObject.width}%`,
            height: `${videoObject.height}%`,
            zIndex: `${videoObject.zIndex}`,
            left: `${videoObject.x}%`,
            top: `${videoObject.y}%`
          }}
          allow="fullscreen; autoplay"
        />
      ))}{' '}
    </>
  );
};
export default PreviewVideos;
