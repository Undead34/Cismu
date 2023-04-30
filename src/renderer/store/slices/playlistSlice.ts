import { Music } from "../../../shared/types/cismu";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaylistState {
  queue: Music[];
  currentIndex: number;
}

const initialState: PlaylistState = {
  queue: [],
  currentIndex: 0,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setQueue: (state, action: PayloadAction<Music[]>) => {
      state.queue = action.payload;
      state.currentIndex = 0;
    },
    next: (state) => {
      state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    },
    prev: (state) => {
      state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    },
    random: (state) => {
      const randomIndex = Math.floor(Math.random() * state.queue.length);
      state.currentIndex = randomIndex;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    addMusic: (state, action: PayloadAction<Music>) => {
      state.queue.push(action.payload);
    },
    removeMusic: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((music) => music.id !== action.payload && music.file !== action.payload);
    },
  },
});

export const { setQueue, next, prev, random, setCurrentIndex, addMusic, removeMusic } = playlistSlice.actions;

export const selectCurrent = (state: { playlist: PlaylistState }): Music =>
  state.playlist.queue[state.playlist.currentIndex];

export default playlistSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IPlaylist, Music } from "../../../shared/types/cismu";

// interface IPlaylistState {
//   playlist: IPlaylist;
// }

// const initialState: IPlaylistState = {
//   playlist: {
//     name: "playlist",
//     total_songs: 0,
//     songs: [],
//   },
// };

// const playlistSlice = createSlice({
//   name: "playlist",
//   initialState,
//   reducers: {
//     setPlaylist: (state, action: PayloadAction<Music[]>) => {
//       state.playlist.songs = action.payload;
//     },

//     updatePlaylist: (state, action: PayloadAction<IPlaylist>) => {
//       const { playlist } = state;
//       const { songs: newSongs } = action.payload;

//       const existingSongs = new Set(playlist.songs.map(({ id }) => id));
//       const updatedSongs = [...playlist.songs.filter(({ id }) => !existingSongs.has(id)), ...newSongs];

//       state.playlist = {
//         ...action.payload,
//         songs: updatedSongs,
//         total_songs: updatedSongs.length,
//       };
//     },
//   },
// });

// export const { setPlaylist, updatePlaylist } = playlistSlice.actions;
// export default playlistSlice.reducer;
