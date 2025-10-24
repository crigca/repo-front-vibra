/* 
  Main.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* Components */
import SearchSection from "./SearchSection";
import ResultsSection from "./ResultsSection";

/* types */
import type {SearchProps} from "../types/searchProps";
import type {ResultProps} from "../types/resultProps";
import type {ReproduceProps} from "../types/reproduceProps";

/* hooks */
import SearchContext from "../hooks/searchContext";
/* styles */
import "./main.css";

const Main =(props:{handlerPlayer:any}) => {

  const dataToSearch_0=[{ id: "",
                          title: "",
                          artist: "",
                          duration: "",
                          plays: ""}];

  const [dataFromSearch, setDataFromSearch]:[ResultProps[],any] = useState(dataToSearch_0);
    
  const dataToSearch = (key:SearchProps) => {

    let uri="https://79a431a7-8114-461a-8a77-ebacab5d46a5.mock.pstmn.io";
    
    fetch(uri+"/songs/search?query"+key.search)
      .then(response => response.json())
      .then(data => {
        //console.log("main",data);
        //setDataFromSearch(data.map(searchBy(data,key)));
        if(data.hasOwnProperty("error")){
          console.log('Name:'+data.error.name,'Message:' +data.error.message,'Header:'+data.error.header );
          setDataFromSearch(dataToSearch_0);
        }else
          setDataFromSearch(data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  const toResoult = (key:ResultProps) => {
    setDataFromSearch(key);
  };
  const toReproduce = (key:ReproduceProps) => {
    props.handlerPlayer(key);
  };
  //console.log(dataFromSearch);
  return (
    <>      
      <main className="main-content">
        <SearchContext.Provider value={{dataToSearch,// callback from search
                                        toReproduce, // callback from Resoults
                                        toResoult,   // callback from Search>most(suggestion)
                                        dataFromSearch}} > {/* data to render Results */}
          <SearchSection/>
          <ResultsSection/>
        </SearchContext.Provider>

      </main>
    </>
  );
}

export default Main;