import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import MyProfile from "./components/myprofile";

function App() {
  return (

      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
      </Router>

  );
}

export default App;
