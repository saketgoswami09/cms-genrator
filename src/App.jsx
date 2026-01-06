import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import "./App.css";
import SignUp from "./pages/SignUp";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>}></Route>
        <Route path="/register" element={<SignUp/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
