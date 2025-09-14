/* 
  Main.tsx
 */

/* Dependencies  */
import { useEffect, useState } from "react";

/* types */
import type {ResultProps} from "../types/resultProps";

/* Components */
import SearchSection from "./SearchSection";
import ResultsSection from "./ResultsSection";

/* styles */

const Main =() => {
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

    const [dataFromChild, setDataFromChild] = useState("");

    const handleChildData = (data:string) => {
      fetch('/data/data.json')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setDataFromChild(data);
          console.log(subjets);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      } 
    };

    return (
      <>
        <main className="main-content">
            <SearchSection onDataSend={handleChildData} />
            <ResultsSection onDataRecive={dataFromChild} />
        </main>
      </>
    );
}

export default Main;