
export function MusicPlayer() {
    return(
        <div className="musicPlayerMainContainer">

            <nav className="musicPlayerLeftNav">

                <div className="albumArtContainer"></div>
                <div className="trackInfoContainer">
                    <div className="trackTitle">Track Title</div>
                    <div className="artistName">Artist Name</div>
                </div>
            </nav>
            <nav className="musicPlayerCenterNav">

                <div className="musicControlsContainer">
                    <div className="controlButton">⏮️</div>
                    <div className="controlButton">▶️</div>
                    <div className="controlButton">⏭️</div>
                </div>

                <nav className="progressBarContainer">
                    <div className="currentTime">0:00</div>
                </nav>

            </nav>
            <nav className="musicPlayerRightNav">
                <div className="volumeControl">🔊</div>
                <div className="playlistControl">📃</div>
                <div className="iaImagesControl">🖼️</div>
            </nav>
        </div>
    )
}