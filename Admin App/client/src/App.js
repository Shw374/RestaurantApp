import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LookerEmbed from "./components/looker_embed";

function App() {
  // get userId from cookies each page where you're required to send to server
  

  return (
    <Router>
      <Routes>
                 
        <Route path="/looker_1" element= {<LookerEmbed />} />
        </Routes>
    </Router>
  );
}

export default App;

