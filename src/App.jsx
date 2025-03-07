import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap"
import Sidebar from "./components/SideBar"
import MusicList from "./components/MusicList"
import Player from "./components/Player"
import { musicData } from "./data/musicData"
import "./styles/App.scss"
function App() {
  const [songs, ] = useState(musicData)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("forYou")
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const audioRef = useRef(null)
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])
  useEffect(() => {
    const storedRecentlyPlayed = sessionStorage.getItem("recentlyPlayed")
    if (storedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(storedRecentlyPlayed))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])
  useEffect(() => {
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed))
  }, [recentlyPlayed])
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  const currentSong = songs[currentSongIndex]
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  const handleSongEnd = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    addToRecentlyPlayed(songs[nextIndex])
  }
  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
    addToRecentlyPlayed(songs[prevIndex])
  }
  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    addToRecentlyPlayed(songs[nextIndex])
  }
  const handleSongSelect = (index) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
    addToRecentlyPlayed(songs[index])
  }
  const addToRecentlyPlayed = (song) => {
    const filteredList = recentlyPlayed.filter((item) => item.title !== song.title)
    const newList = [song, ...filteredList].slice(0, 10)
    setRecentlyPlayed(newList)
  }
  const toggleFavorite = (song) => {
    const isFavorite = favorites.some((fav) => fav.title === song.title)

    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.title !== song.title))
    } else {
      setFavorites([...favorites, song])
    }
  }
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
  const displaySongs = () => {
    switch (activeTab) {
      case "favorites":
        return favorites
      case "recentlyPlayed":
        return recentlyPlayed
      default:
        return filteredSongs
    }
  }
  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,1)), 
                  url(${currentSong.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <Container fluid className="app-container">
        <Row>
          {showSidebar && (
            <Col md={3} lg={2} className="sidebar-container">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </Col>
          )}
          <Col md={showSidebar ? 9 : 12} lg={showSidebar ? 10 : 12}>
            <Row className="content-area">
              <Col xs={12} className="search-container">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search Song, Artist"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={8} className="music-list-container">
                <MusicList
                  songs={displaySongs()}
                  currentSongIndex={currentSongIndex}
                  onSongSelect={handleSongSelect}
                  isPlaying={isPlaying}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  activeTab={activeTab}
                />
              </Col>
              <Col xs={12} md={4} className="player-container">
                <Player
                  song={currentSong}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  audioRef={audioRef}
                  onEnded={handleSongEnd}
                  toggleSidebar={() => setShowSidebar(!showSidebar)}
                  showSidebarToggle={!showSidebar}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default App