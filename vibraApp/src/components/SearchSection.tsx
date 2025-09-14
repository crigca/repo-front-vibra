/* 
  SearchSection.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* types */

/* Components */

/* styles */

const SearchSection =(props) => {
    useEffect(() => {
    fetch('/data/data.json')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.subjets);
        setSubjets(data.subjets);
        console.log(subjets);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, []);// on render

    const [subjets, setSubjets] = useState([]);

    const sendDataToParent = () => {
        props.onDataSend("");
      };

    return (
      <>
            <section className="search-section">
                <div className="welcome-text">
                    <h1 className="welcome-title">¿Qué quieres escuchar hoy?</h1>
                    <p className="welcome-subtitle">Busca cualquier canción y disfruta de visualizaciones únicas generadas por IA</p>
                </div>

                <div className="search-container">
                    <form className="search-form" onsubmit="handleSearch(event)">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Buscar canciones, artistas, álbumes..." 
                            id="searchInput"
                            autocomplete="off"
                        >
                        <button onClick={sendDataToParent} type="submit" className="search-btn" id="searchBtn">
                            <span>🔍</span>
                            Buscar
                        </button>
                    </form>
                    
                    <div className="search-suggestions">
                        <div className="suggestion-tag" onclick="searchSuggestion('Bohemian Rhapsody Queen')">Bohemian Rhapsody</div>
                        <div className="suggestion-tag" onclick="searchSuggestion('Hotel California Eagles')">Hotel California</div>
                        <div className="suggestion-tag" onclick="searchSuggestion('Stairway to Heaven')">Stairway to Heaven</div>
                        <div className="suggestion-tag" onclick="searchSuggestion('Imagine John Lennon')">Imagine</div>
                        <div className="suggestion-tag" onclick="searchSuggestion('Billie Jean Michael Jackson')">Billie Jean</div>
                    </div>
                </div>
            </section>
      </>
    );
}


export default SearchSection;