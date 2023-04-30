import { addMusic, setQueue, removeMusic } from "../store/slices/playlistSlice";
import { Music } from "../../shared/types/cismu";
import store from "../store/store";
import { v4 as uuid } from "uuid";

window.CismuAPI.receive("cismu:update-musics", (event, music: Music[]) => {
  store.dispatch(setQueue(music));
  document.dispatchEvent(new CustomEvent("playlist:set"));
});

window.CismuAPI.receive("cismu:add-music", (event, music: Music) => {
  store.dispatch(addMusic(music));
});

window.CismuAPI.receive("cismu:remove-music", (event, musicPath) => {
  console.log(musicPath)
  store.dispatch(removeMusic(musicPath));
});
