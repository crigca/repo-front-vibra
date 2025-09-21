/* 
  Main.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* Components */
import SearchSection from "./SearchSection";
import ResultsSection from "./ResultsSection";

/* types */
import type {ResultProps} from "../types/resultProps";
import type {SearchProps} from "../types/searchProps";


/* hooks */
//import SearchContext from "../hooks/searchContext";
/* styles */

const Main =(props:{handlerPlayer:any}) => {
  const type:string[]=["artist","song","album"];
  const [dataFromSearch, setdataFromSearch]:[ResultProps[],any] = useState([]);
    
  const handleChildData = (key:SearchProps) => {

    let uri="";
    switch (type[key.type]) {
      case "song":
        uri="https://79a431a7-8114-461a-8a77-ebacab5d46a5.mock.pstmn.io/song:"+key.id;
        break;
      case "artist":
        uri="https://79a431a7-8114-461a-8a77-ebacab5d46a5.mock.pstmn.io/artist:"+key.id;
        break;
      case "album":
        uri="https://79a431a7-8114-461a-8a77-ebacab5d46a5.mock.pstmn.io/album:"+key.id;
        break;  
      default:
        uri="https://ee7fa148-ce19-471c-aa0c-928b90cdaf6d.mock.pstmn.io/"+key.title;
        break;
    }
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        //console.log("main",data);
        //setdataFromSearch(data.map(searchBy(data,key)));
        if(data.hasOwnProperty("error")){
          console.log('Name:'+data.error.name,'Message:' +data.error.message,'Header:'+data.error.header );
          setdataFromSearch({});
        }else
          setdataFromSearch(data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  //console.log(dataFromSearch);
  return (
    <>      
      <main className="main-content">
        {/* <SearchContext.provider value={subjets} > */}
          <SearchSection  dataToSearch={handleChildData} />
          <ResultsSection playTrack={props.handlerPlayer} dataRecive={dataFromSearch} />
        {/* </SearchContext.provider> */}

      </main>
    </>
  );
}

export default Main;