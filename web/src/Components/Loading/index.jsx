import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="backdrop">
      <div className="pop-up">
        <div id="loading">
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
