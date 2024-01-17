import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="backdrop">
      <div className="pop-up" id="loading">
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
