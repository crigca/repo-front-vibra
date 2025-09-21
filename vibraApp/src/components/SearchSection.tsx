/* 
  SearchSection.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

/* types */
import type {DynamicProps} from "../types/dynamicProps";
import type {SearchProps} from "../types/searchProps";

import type {SearchSectionProps} from "../types/searchSectionProps";


/* Components */
import ShowBox from "./showBox";

/* styles */

const SearchSection =(props:SearchSectionProps) => {
  const [dataDynamic, setDataDynamic]:[DynamicProps[],any] = useState([]);
  const [valueCurrent, setValueCurrent]:[string,any] = useState("");
  const [objectCurrent, setObjectCurrent]:[SearchProps,any] = useState({id:0,
                                                                        title:"",
                                                                        artist:"",
                                                                        album:"",
                                                                        type:1 });
  const [most, setMost]:[DynamicProps[],any] = useState([]);
  const type:string[]=["artist","song","album"];

  useEffect(() => {
    
    fetch('https://ade70352-2ece-43e0-b556-99be0ea93ac1.mock.pstmn.io/most')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        //console.log(data.subjets);
        setMost(data);
        //console.log(subjets);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);// on render
    //dataDynamicSearch={handleChildDynamicSearch}   
    
  const handleChildDynamicSearch = (key:string) => {
    console.log("Dynamic Searchs");
    //must be url/all/key
    fetch('https://ee7fa148-ce19-471c-aa0c-928b90cdaf6d.mock.pstmn.io/'+key)
      .then(response => response.json())
      .then(data => {
        if(data.hasOwnProperty("error"))
          console.log('Name:'+data.error.name,'Message:' +data.error.message,'Header:'+data.error.header );
        else
          setDataDynamic(data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });       
  };

  /* sendDataToParent */
  const handleSearchSubmit = (event:any) => {
    event.preventDefault();
    let data:SearchProps={
      id:0,
      type:0,
      title:"",
      album:"",
      artist:""
    };
    data.id=event.target["id"].value;
    data.type=event.target["type"].value;
    data.title=event.target["title"].value;
    data.album=event.target["album"].value;
    data.artist=event.target["artist"].value;
    //console.log(data);
    if(event.target["search"].value.length)
      props.dataToSearch(data); //callback func(searchProp object)
    setValueCurrent(event.target["search"].value);
  };

  /* auto complete and search */
  const handleInputChange = (event:any) => {
      event.preventDefault();
      if(event.target.value.length)
        handleChildDynamicSearch(event.target.value);
      else
        setDataDynamic("");
      setValueCurrent(event.target.value);
  };
  /* auto complete and search */
  const handleChildSelectData = (event:any) => {
    event.preventDefault();
    let data:SearchProps={
      type:event.target.value.split("-")[0],
      id:event.target.value.split("-")[1],
      title:"",
      album:"",
      artist:""
    };
    let value:string="";
    let text:string=event.target.options[event.target.selectedIndex].text;
    let sV:string[]=text.split(" - ");
    switch (type[data.type]) {
      case "artist":
        data.artist=sV[0];
        value= data.artist;
        break;
      case "song":
        data.title=sV[0];
        data.album=sV[1];
        data.artist=sV[2];
        value= data.title+" - "+data.album+" - "+data.artist;
      break;
      case "album":
        data.album=sV[0];
        data.artist=sV[1];
        value=data.album+" - "+data.artist;
      break;
    }
    setObjectCurrent(data);
    setValueCurrent(text);
  };
  
  /* auto complete and search */
  const renderSuggestion = (datum:DynamicProps) => {
    return (<div className="suggestion-tag" onClick={props.dataToSearch({
                                                                         id:datum.id,
                                                                         type:1,
                                                                         title:datum.title,
                                                                         artist:datum.artist,
                                                                         album:datum.album})}>
            {datum.title}
            </div>);
  };

  return (
    <>
      <section className="search-section">
          <div className="welcome-text">
              <h1 className="welcome-title">¿Qué quieres escuchar hoy?</h1>
              <p className="welcome-subtitle">Busca cualquier canción y disfruta de visualizaciones únicas generadas por IA</p>
          </div>

          <div className="search-container">
              <form className="search-form" onSubmit={handleSearchSubmit}>
                  <input type="hidden" value={objectCurrent.id}    name="id" disabled></input>
                  <input type="hidden" value={objectCurrent.title} name="title" disabled></input>
                  <input type="hidden" value={objectCurrent.artist}name="artist" disabled></input>
                  <input type="hidden" value={objectCurrent.album} name="album" disabled></input>
                  <input type="hidden" value={objectCurrent.type}  name="type" disabled></input>
                  <input 
                      type="text"
                      className="search-input" 
                      placeholder="Buscar canciones, artistas, álbumes..." 
                      id="searchInput"
                      autoComplete="off"
                      onChange={handleInputChange}
                      value={valueCurrent}
                      name="search"
                  > </input>
                  <ErrorBoundary fallback={<p>Something went wrong</p>}  >
                    <ShowBox dataShow={dataDynamic} dataSelect={handleChildSelectData}/>      
                  </ErrorBoundary>
                  <button  type="submit" className="search-btn" id="searchBtn">
                    <span>🔍</span>
                    Buscar
                  </button>
              </form>
              
              <div className="search-suggestions">
                {most.map(renderSuggestion)}                    
              </div>
          </div>
      </section>
    </>
  );
}


export default SearchSection;