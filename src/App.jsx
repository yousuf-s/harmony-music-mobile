import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Search, Home, Library, Heart,
  Volume2, VolumeX, Shuffle, Repeat, ChevronDown, ListMusic, Mic2
} from 'lucide-react';

const mockSongs = [
  {
    id: "1",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    duration: "3:50",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop"
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop"
  },
  {
    id: "4",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:35",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop"
  }
];

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(mockSongs);
  const [currentTrack, setCurrentTrack] = useState(mockSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const audioRef = useRef(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(mockSongs);
    } else {
      setResults(mockSongs.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase())
      ));
    }
  }, [query]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 50);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-white select-none">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header / Search Bar */}
      <div className="p-4 pt-8 bg-neutral-900 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight text-red-500 mb-3">Harmony Music</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Song List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
        <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">Results</p>
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => handleSelectTrack(song)}
            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition ${
              currentTrack?.id === song.id ? 'bg-neutral-800' : 'hover:bg-neutral-900 active:scale-[0.98]'
            }`}
          >
            <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold truncate ${currentTrack?.id === song.id ? 'text-red-400' : 'text-white'}`}>
                {song.title}
              </h3>
              <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
            </div>
            <span className="text-xs text-neutral-500">{song.duration}</span>
          </div>
        ))}
      </div>

      {/* Mini Player Bar */}
      {currentTrack && !expanded && (
        <div
          onClick={() => setExpanded(true)}
          className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-3 flex items-center justify-between z-40 cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-11 h-11 rounded-lg object-cover" />
            <div className="overflow-hidden">
              <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
              <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white active:scale-90"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Player Modal */}
      {expanded && currentTrack && (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col p-6 z-50">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setExpanded(false)} className="p-2 -ml-2 text-neutral-400 active:text-white">
              <ChevronDown size={28} />
            </button>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">Now Playing</p>
            <div className="w-8"></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-64 h-64 rounded-2xl shadow-2xl object-cover mb-8"
            />
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1 truncate">{currentTrack.title}</h2>
              <p className="text-neutral-400 text-base truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="w-full space-y-4 mb-8">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Shuffle className="text-neutral-500 w-5 h-5 cursor-pointer" />
              <SkipBack className="text-white w-7 h-7 cursor-pointer active:scale-90" />
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white active:scale-95 shadow-lg shadow-red-900/40"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <SkipForward className="text-white w-7 h-7 cursor-pointer active:scale-90" />
              <Repeat className="text-neutral-500 w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}