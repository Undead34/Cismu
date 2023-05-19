import TopLoadingBar from "../components/TopLoadingBar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import "./Welcome.css";

interface IAction {
  message: string;
  code?: 0o1000;
}

export function Welcome() {
  return (
    <>
      <Link to={"/"}>Go</Link>
    </>
  )
}


// #060912, #213348, #144D63, #C7C8CE

{
  /* <div className="music-loader">
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
<div className="music-item"></div>
</div> */
}
