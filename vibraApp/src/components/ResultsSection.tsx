/* 
  ResultsSection.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* types */
import type {ResultProps} from "../types/resultProps";

/* Components */

/* styles */


const ResultsSection =(props:ResultProps[]) => {

    const [subjets, setSubjets] = useState([]);


    const displayResults= (data:ResultProps[]) => {
      const resultsContainer = document.getElementById('searchResults');
      if (data.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">😔</div>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
      }
    }

    const resultsHTML = `
        <div class="results-grid">
            ${data.map(datum => `
                <div class="result-card" data-track-id="${datum.id}">
                    <div class="result-thumbnail">
                        🎵
                    </div>
                    <div class="result-info">
                        <h3 class="result-title">${datum.title}</h3>
                        <p class="result-artist">${datum.artist}</p>
                        <p class="result-duration">${datum.duration}</p>
                        <button class="play-btn" onclick="playTrack('${datum.id}', '${datum.title}', '${datum.artist}')">
                            <span>▶️</span>
                            Reproducir con IA
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    resultsContainer.innerHTML = resultsHTML;
    searchResults = results;
}



    return (
      <>
        {
          props.map( prop => (
            <section className="results-section">
              <div id="searchResults">
                <div className="empty-state">
                  <div className="icon">🎵</div>
                  <h3>Busca tu música favorita</h3>
                  <p>Usa el buscador de arriba para encontrar canciones y crear visualizaciones únicas</p>
                </div>
              </div>
            </section>
          ))
        }
      </>
    );
}


export default ResultsSection;