import { Nav } from "react-bootstrap"
import { FaMusic } from "react-icons/fa"
import "../styles/Sidebar.scss"

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <FaMusic className="logo-icon" />
        <span>Spotify</span>
      </div>

      <Nav className="flex-column">
        <Nav.Link className={activeTab === "forYou" ? "active" : ""} onClick={() => setActiveTab("forYou")}>
          <span>For You</span>
        </Nav.Link>

        <Nav.Link className={activeTab === "topTracks" ? "active" : ""} onClick={() => setActiveTab("topTracks")}>
          <span>Top Tracks</span>
        </Nav.Link>

        <Nav.Link className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>
          <span>Favourites</span>
        </Nav.Link>

        <Nav.Link
          className={activeTab === "recentlyPlayed" ? "active" : ""}
          onClick={() => setActiveTab("recentlyPlayed")}
        >
          <span>Recently Played</span>
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default Sidebar