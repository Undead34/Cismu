import { Route, Routes, Link } from "react-router-dom";
import PlaylistTable from "./components/PlaylistTable/PlaylistTable"
// Components
import Player from "./components/Player";
// import Library from "./views/Library";
// import Search from "./views/Search";
// import Home from "./views/Home";

import "./styles/app.css";


function Home() {
  const data = [
    { index: 5, liked: true, title: "E", duration: 120 },
    { index: 4, liked: false, title: "D", duration: 123 },
    { index: 3, liked: true, title: "C", duration: 100 },
    { index: 1, liked: false, title: "A", duration: 90 },
    { index: 2, liked: true, title: "B", duration: 150 },
  ]

  return (
    <>
      <h1>Home</h1>
      <PlaylistTable data={data} />
    </>
  )
}

function Library() {
  return (
    <>
      <h1>Library</h1>
      <Link to={"/"} className="button-link"><button className="button-primary" >Home</button></Link>
    </>
  )
}

function Foryou() {
  return (
    <>
      <h1>Foryou</h1>
      <Link to={"/"} className="button-link"><button className="button-primary" >Home</button></Link>
    </>
  )
}

function Discover() {
  return (
    <>
      <h1>Discover</h1>
      <Link to={"/"} className="button-link"><button className="button-primary" >Home</button></Link>
    </>
  )
}

function Local() {
  return (
    <>
      <h1>Local</h1>
      <Link to={"/"} className="button-link"><button className="button-primary" >Home</button></Link>
    </>
  )
}

export default function App() {
  return (
    <div className="app-container">
      <div className="navbar">
        <div className="button-group">
          <Link to={"/library"} className="button-link"><button className="button-primary" >Library</button></Link>
          <Link to={"/foryou"} className="button-link"><button className="button-primary" >For You</button></Link>
          <Link to={"/discover"} className="button-link"><button className="button-primary" >Discover</button></Link>
          <Link to={"/local"} className="button-link"><button className="button-primary" >Local</button></Link>
        </div>
      </div>
      <div className="sidebar"></div>
      <div className="main-view">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/foryou" element={<Foryou />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/local" element={<Local />} />
        </Routes>
      </div>
      <Player />
    </div>
  );
}




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
