/* 
  ResultsSection.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* types */
import type {ResultProps} from "../types/resultProps";

/* Components */

/* styles */


const ResultsSection =(props:{playTrack:any,dataRecive:ResultProps[]}) => {

    const vSt:string[]=["init","result","results","notFound"];
    const [state,setState]=useState(vSt[0]);
          
    useEffect(()=>{
        //console.log("Result",props.dataRecive,props.dataRecive.hasOwnProperty("id"));
        console.log("state: "+state);
        if (props.dataRecive instanceof Array){
          console.log("Array");
          if(props.dataRecive.length === 0) {
            /*not found something */ 
            setState(vSt[3]);
          }else{
            /*at least some one */
            setState(vSt[2]);
          }
        }else if (props.dataRecive.hasOwnProperty("id")){//object
            /*only one*/
           console.log("Object");
           setState(vSt[1]);
        }else{
           setState(vSt[3]);
        }
      }
      ,[props.dataRecive]);// on mount and change

    const displayResults= () => {

      switch (state) {
        case "init":
            return( <>
                <div className="empty-state">
                  <div className="icon">🎵</div>
                  <h3>Busca tu música favorita</h3>
                  <p>Usa el buscador de arriba para encontrar canciones y crear visualizaciones únicas</p>
                </div>
              </>
            );
          break;
        case "result":
            var data:ResultProps=props.dataRecive;
            //console.log("result",props.dataRecive,data);
            return (
              <div className="results-grid">
                <div className="result-card" data-track-id="${data.id}">
                  <div className="result-thumbnail">🎵</div>
                  <div className="result-info">
                    <h3 className="result-title">{data.title}</h3>
                    <p className="result-artist">{data.artist}</p>
                    <p className="result-duration">{data.duration}</p>
                    <button className="play-btn" onClick={props.playTrack(data.id,data.title,data.artist)}>
                      <span>▶️</span>
                      Reproducir con IA
                    </button>
                  </div>
                </div>
              </div>
            );
          break;
        case "results":
            return(
              <div className="results-grid">
                { props.dataRecive.map(datum =>
                    <div className="result-card" data-track-id={datum.id}>
                      <div className="result-thumbnail">🎵</div>
                      <div className="result-info">
                        <h3 className="result-title">{datum.title}</h3>
                        <p className="result-artist">{datum.artist}</p>
                        <p className="result-duration">{datum.duration}</p>
                        <button className="play-btn" /* onClick={props.playTrack(datum.id, datum.title, datum.artist)} */>
                        <span>▶️</span>Reproducir con IA</button>
                      </div>
                    </div>
                  ) }
              </div>)
            ;
          break;
        case "notFound":
          return (
            <div className="empty-state">
                <div className="icon">😔</div>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>);
          break;
      
        default:
          break;
      }
    }

    const Results=()=>{
      return displayResults();
    };
    
    return(
          <>
            <section className="results-section">
              <div id="searchResults">
                <Results/>                
              </div>
            </section>
          </>);    

}

export default ResultsSection;