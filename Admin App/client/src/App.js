import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LookerEmbed from "./components/looker_embed";
import Dashboard from "./components/Dashboard";
import LookerView from "./components/LookerView";

function App() {
  // get userId from cookies each page where you're required to send to server
  return (
    <Router>
      <Routes>         
        <Route path="/" element={<Dashboard />} />
        <Route path="/looker_1" element= {<LookerEmbed />} />
        <Route path="/looker-view/:id" element={<LookerView />} />
        </Routes>
    </Router>
  );
}

export default App;
