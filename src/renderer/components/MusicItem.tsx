interface IMusicItem {
  id: string;
  path: string;
  name: string;
  duration: number;
  timeoffset: number;
  album: number;
  year: number;
  artist: string;
}


export function MusicItem(item: IMusicItem) {
  return (
    <div>
      <ul>
        <li>{item.name}</li>
      </ul>
    </div>
  )
}
