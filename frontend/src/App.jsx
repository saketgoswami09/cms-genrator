import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

// import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
      <Routes>
        <Route path="/" element={<div>Home</div>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
