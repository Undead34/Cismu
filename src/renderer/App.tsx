// React/React Router
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import "./ipcRenderer"

// Redux
import { Provider } from "react-redux";
import store from "./store/store";

// Components
import Search from "./views/Search";
import Home from "./views/Home";
import Library from "./views/Library";
import Player from "./components/Player";

// Styles
import "./index.css";
import { Welcome } from "./views/Welcome";

function App() {
  return (
    <div className="app-container">
      <div className="nav-bar"></div>
      <div className="side-bar"></div>
      <div className="main-view">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/search" Component={Search} />
          <Route path="/library" Component={Library} />
        </Routes>
      </div>
      <div className="left-bar"></div>
      <Player />
    </div>
  );
}

// Render App in DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" Component={Welcome} />
          <Route path="*" Component={App} />
        </Routes>
      </HashRouter>
    </Provider>
  </>
);


// {musicList.map((music) => <h5 key={uuid()}>{music}</h5>)}


// const [musicList, useMusicList] = useState([])
// // Escucha el evento click derecho en algún elemento de la vista
// document.addEventListener('contextmenu', (event) => {
//   event.preventDefault()
//   // window.CismuAPI.send({ x: event.x, y: event.y })
// })

// window.CismuAPI.receive("receive:update-music-list", (event, music_list) => {
//   useMusicList(music_list)
//   console.log("Jaja")
// })

// import { HashRouter } from "react-router-dom"
// import ReactDOM from "react-dom/client";
// import React from "react";
// import "./index.css"

// function App() {
//   return (
//     <div className="app-container">
//       <div className="nav-bar"></div>
//       <div className="side-bar"></div>
//       <div className="main-view">
//         {window.CismuAPI}
//       </div>
//       <div className="left-bar"></div>
//       <div className="web-player">
//         <input type="range" value={0} min={0} max={200} step={1} />
//         <button>back</button>
//         <button>play/pause</button>
//         <button>next</button>
//         <input type="range" value={0.75} min={0} max={1} step={0.1} />
//       </div>
//     </div>
//   )
// }

// const root = ReactDOM.createRoot(document.getElementById("root"))
// root.render(
//   <React.StrictMode>
//     <HashRouter>
//       <App />
//     </HashRouter>
//   </React.StrictMode>
// )
