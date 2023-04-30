import TopLoadingBar from "../components/TopLoadingBar";
import React, { useEffect, useState } from "react";
import "./Welcome.css";

interface IAction {
  message: string;
  code?: 0o1000;
}

export function Welcome() {
  const [action, setAction] = useState<IAction>({
    message: "Welcome"
  });

  useEffect(() => {
    (async () => {
      const result = await window.CismuAPI.invoke<IAction>("cismu:get-state");
      setAction(result);
    })()
  }, []);

  return (
    <div className="welcome">
      <h2>{action.message}</h2>
    </div>
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
