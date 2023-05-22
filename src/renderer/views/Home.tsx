import { useAppSelector } from "../store/slices/hooks";
import { Music } from "../../shared/types/cismu";
import { v4 as uuid } from "uuid";

function Home() {
  return (
    <div>

    </div>
  )
}

export default Home;

{/* <button className="button-primary" >Get</button> */ }

// const songs = useAppSelector((state) => state.playlistReducer.queue)
// const currentIndex = useAppSelector((state) => state.playlistReducer.currentIndex)

// const jsxSound = songs.map((music: Music) => {
//   return <h6 data-url={encodeURI(music.id)} onClick={(event) => {
//     document.dispatchEvent(new CustomEvent("playmusic", {
//       detail: {
//         id: event.currentTarget.getAttribute("data-url"),
//       },
//     }))
//   }} style={{ cursor: "pointer", textDecoration: "overline", color: songs[currentIndex].id === music.id ? "#FF0000" : "000000" }} key={uuid()}>{`Title: ${music.title} Artist: ${music.artist} Album: ${music.album} Year: ${music.year}`}</h6>
// })
