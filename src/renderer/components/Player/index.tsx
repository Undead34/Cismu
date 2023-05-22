import { next, prev, setCurrentIndex } from "../../../renderer/store/slices/playlistSlice";
import { Music } from "../../../shared/types/cismu";
import store from "../../../renderer/store/store";
import React from "react";
import { IoMdPause, IoMdVolumeHigh, IoMdAdd } from "react-icons/io";
import { AiFillForward, AiFillBackward, AiFillHeart } from "react-icons/ai"
import { MdPlaylistAdd } from "react-icons/md"
import { TfiLoop } from "react-icons/tfi"
import { BsShuffle } from "react-icons/bs"
import "../../styles/player.css";


class AudioPlayer {
  private audioElement: HTMLAudioElement;
  private listeners: { eventName: string, listener: () => void }[];

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.autoplay = true;
    this.audioElement.volume = .5;
    this.audioElement.src = null;
    this.listeners = [];

    this.audioElement.addEventListener('error', (event: any) => {
      switch (event.target.error.code) {
        case event.target.error.MEDIA_ERR_ABORTED:
          console.log('La carga del archivo de audio ha sido cancelada.');
          break;
        case event.target.error.MEDIA_ERR_NETWORK:
          console.log('Se ha producido un error de red al cargar el archivo de audio.');
          break;
        case event.target.error.MEDIA_ERR_DECODE:
          console.log('No se ha podido decodificar el archivo de audio.');
          break;
        case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.log('El formato del archivo de audio no es compatible con el navegador.');
          break;
        default:
          console.log('Se ha producido un error desconocido al cargar el archivo de audio.');
          break;
      }
    });
  }

  async play() {
    try {
      await this.audioElement.play();
    } catch (e) {
      // ignore
    }
  }

  addEventListener(eventName: string, listener: () => void): void {
    this.listeners.push({ eventName, listener });
    this.audioElement.addEventListener(eventName, listener);
  }

  removeEventListener(eventName: string, listener: () => void): void {
    this.audioElement.removeEventListener(eventName, listener);
  }

  removeAllListeners() {
    // Remove all listeners
    this.listeners.map(listener => this.removeEventListener(listener.eventName, listener.listener));
  }

  pause() {
    this.audioElement.pause();
  }

  close() {
    this.audioElement.pause();
    this.audioElement.src = null;
    this.audioElement.remove();
  }

  get paused(): boolean {
    return this.audioElement.paused;
  }

  get currentTime(): number {
    return this.audioElement.currentTime;
  }

  set currentTime(value: number) {
    this.audioElement.currentTime = value;
  }

  get duration(): number {
    return this.audioElement.duration;
  }

  get volume(): number {
    return this.audioElement.volume;
  }

  set volume(value: number) {
    this.audioElement.volume = value;
  }

  get src(): string {
    return this.audioElement.currentSrc
  }

  set src(value: string) {
    this.audioElement.src = value;
    this.audioElement.load();
  }
}

interface IProps {
  saludo?: string
}

interface IState {
  currentTime: number
  duration: number
  volume: number
  autoplay: boolean
}

class Player extends React.Component<IProps, IState> {
  state: IState;
  audioPlayer: AudioPlayer;
  debug: any

  constructor(props: IProps) {
    super(props);
    this.state = { currentTime: 0, duration: 0, volume: .5, autoplay: false };
    this.audioPlayer = null;
  }

  componentDidMount(): void {
    this.audioPlayer = new AudioPlayer();

    this.audioPlayer.addEventListener("timeupdate", () => {
      this.setState({ currentTime: this.audioPlayer.currentTime })
    })

    this.audioPlayer.addEventListener("durationchange", () => {
      this.setState({ duration: this.audioPlayer.duration })
    })

    document.addEventListener("playmusic", (e: CustomEvent) => {
      const state = store.getState();
      const songs: Music[] = state.playlistReducer.queue;
      const music = songs.filter((music) => music.id === e.detail.id);
      const firstIndex = songs.indexOf(music[0]);
      store.dispatch(setCurrentIndex(firstIndex));

      this.audioPlayer.pause();
      this.audioPlayer.src = music[0].file;
      this.audioPlayer.play();
    })
  }

  componentWillUnmount(): void {
    this.audioPlayer.removeAllListeners()
    this.audioPlayer.close()
    this.audioPlayer = undefined
  }

  togglePlayPause(): void {
    this.audioPlayer.paused ? this.audioPlayer.play() : this.audioPlayer.pause();
  }

  setVolume(volume: number): void {
    this.setState({ volume: volume });
    this.audioPlayer.volume = volume;
  }

  setCurrentTime(time: number): void {
    this.setState({ currentTime: time });
    this.audioPlayer.currentTime = time
  }

  next() {
    store.dispatch(next())

    const state = store.getState();
    const songs: Music[] = state.playlistReducer.queue;
    const currentIndex = state.playlistReducer.currentIndex;

    this.audioPlayer.pause();
    this.audioPlayer.src = songs[currentIndex] ? songs[currentIndex].file : null;
    this.audioPlayer.play();
  }

  prev() {
    store.dispatch(prev())

    const state = store.getState();
    const songs: Music[] = state.playlistReducer.queue;
    const currentIndex = state.playlistReducer.currentIndex;

    this.audioPlayer.pause();
    this.audioPlayer.src = songs[currentIndex] ? songs[currentIndex].file : null;
    this.audioPlayer.play();
  }

  render() {
    return (
      <div className="web-player">
        <div className="box-left">
          Hola
        </div>
        <PlayerControls />
        <div className="box_right" >
          <button><IoMdAdd /></button>
          <button><MdPlaylistAdd /></button>
          <button><AiFillHeart /></button>
          <button><TfiLoop /></button>
          <button><BsShuffle /></button>
        </div>
      </div>
    )
  }
}

function PlayerControls() {
  return (
    <div className="player-controls">
      <div className="controls">
        <div className="controls-buttons">
          <button><AiFillBackward /></button>
          <button><IoMdPause /></button>
          <button><AiFillForward /></button>
        </div>
        <div className="controls-inputs">
          <button><IoMdVolumeHigh /></button>
        </div>
      </div>
      <div className="time-controls">
        <div className="time-controls-data">
          <span>3:58</span>
          <span>-1:53</span>
        </div>
        <div className="time-controls-slider">
          <input min={0} max={100} type="range" />
        </div>
      </div>
    </div>
  );
}

export default Player



{/* <input type="range" value={this.state.volume} onChange={(event) => this.setVolume(parseFloat(event.target.value))} min={0} max={1} step={0.005} /> */ }
{/* <button onClick={() => this.prev()}>back</button> */ }
{/* <button onClick={() => this.togglePlayPause()}>play/pause</button> */ }
{/* <button onClick={() => this.next()}>next</button> */ }
{/* <input type="range" value={this.state.currentTime} onChange={(event) => this.setCurrentTime(parseFloat(event.target.value))} min={0} max={this.state.duration} step={1} /> */ }

// class Playlist {
//   private queue: Music[];
//   private currentIndex: number;

//   constructor() {
//     this.queue = [];
//     this.currentIndex = 0;

//     document.addEventListener("playlist:set", () => {
//       this.queue = store.getState().playlistReducer.playlist.songs
//     })
//   }

//   public next(): Music {
//     this.currentIndex = (this.currentIndex + 1) % this.queue.length;
//     return this.queue[this.currentIndex];
//   }

//   public prev(): Music {
//     this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
//     return this.queue[this.currentIndex];
//   }

//   public random(): Music {
//     const randomIndex = Math.floor(Math.random() * this.queue.length);
//     this.currentIndex = randomIndex;
//     return this.queue[randomIndex];
//   }

//   public getCurrent(): Music {
//     return this.queue[this.currentIndex];
//   }
// }
