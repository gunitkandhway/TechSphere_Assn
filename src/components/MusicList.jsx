import React from "react"
import { ListGroup, Dropdown } from "react-bootstrap"
import { FaPlay, FaPause, FaEllipsisH, FaHeart } from "react-icons/fa"
import "../styles/MusicList.scss"
const MusicList = ({ songs, currentSongIndex, onSongSelect, isPlaying, favorites, toggleFavorite, activeTab }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }
  const isFavorite = (song) => {
    return favorites.some((fav) => fav.title === song.title)
  }

  if (songs.length === 0) {
    return (
      <div className="music-list-empty">
        {activeTab === "favorites"
          ? "No favorite songs yet."
          : activeTab === "recentlyPlayed"
            ? "No recently played songs."
            : "No songs found."}
      </div>
    )
  }
  return (
    <div className="music-list">
      <h2>
        {activeTab === "favorites" ? "Favourites" : activeTab === "recentlyPlayed" ? "Recently Played" : "For You"}
      </h2>
      <ListGroup>
        {songs.map((song, index) => (
          <ListGroup.Item
            key={`${song.title}-${index}`}
            className={`song-item ${songs[currentSongIndex]?.title === song.title ? "active" : ""}`}
            onClick={() => onSongSelect(songs.findIndex((s) => s.title === song.title))}          >
            <div className="song-thumbnail">
              <img src={song.thumbnail || "/placeholder.svg"} alt={song.title} />
              <div className="play-icon">
                {songs[currentSongIndex]?.title === song.title && isPlaying ? <FaPause /> : <FaPlay />}
              </div>
            </div>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artistName}</div>
            </div>
            <div className="song-duration">{formatTime(song.duration)}</div>
            <div className="song-actions">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <FaEllipsisH />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(song)
                    }}
                  >
                    <FaHeart className={isFavorite(song) ? "favorite" : ""} />
                    {isFavorite(song) ? "Remove from Favorites" : "Add to Favorites"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.stopPropagation()
      onClick(e)
    }}
    className="dropdown-toggle"
  >
    {children}
  </div>
))
export default MusicList