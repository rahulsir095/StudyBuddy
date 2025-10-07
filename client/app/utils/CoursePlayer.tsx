import React, { FC } from "react";

type Props = {
  videoId?: string;
  title?: string;
};

const CoursePlayer: FC<Props> = ({ videoId, title }) => {
  return (
    <div style={{ position: "relative", aspectRatio: "16/9",paddingTop:"41%" }}>
      <iframe
        loading="lazy"
        title={title}
        src={`https://play.gumlet.io/embed/${videoId}?autoplay=false&loop=false&disableControls=false`}
        style={{
          border: "none",
          position: "absolute",
          top: 10,
          height: "100%",
          width: "100%",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      />
    </div>
  );
};

export default CoursePlayer;
