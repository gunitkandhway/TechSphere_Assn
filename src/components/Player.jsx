import { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaBars } from "react-icons/fa"
import "../styles/Player.scss"

const Player = ({
  song,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  audioRef,
  onEnded,
  toggleSidebar,
  showSidebarToggle,
}) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.addEventListener("timeupdate", updateTime)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
    }
  }, [audioRef])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error)
      })
    }
  }, [song, isPlaying, audioRef])

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    audioRef.current.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleProgressChange = (e) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  return (
    <div className="player">
      {showSidebarToggle && (
        <Button variant="link" className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </Button>
      )}

      <div className="song-details">
        <h2>{song.title}</h2>
        <p>{song.artistName}</p>
      </div>

      <div className="album-cover">
        <img src={song.thumbnail || "/placeholder.svg"} alt={song.title} />
      </div>

      <div className="progress-container">
        <input
          type="range"
          min="0"
          max={song.duration}
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      <div className="controls">
        <Button variant="link" onClick={onPrevious}>
          <FaStepBackward />
        </Button>

        <Button variant="link" className="play-button" onClick={onPlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>

        <Button variant="link" onClick={onNext}>
          <FaStepForward />
        </Button>
      </div>

      <div className="volume-control">
        <Button variant="link" onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </Button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <audio ref={audioRef} src={song.musicUrl} onEnded={onEnded} autoPlay={isPlaying} />
    </div>
  )
}

export default Player