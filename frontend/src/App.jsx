import { Routes, Route } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GenerateImage from "./pages/GenerateImage";
import Home from "./pages/Home";
import Rewrite from "./pages/Rewrite";
function App() {
  return (
    <>
      <ToastContainer transition={Flip} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/image/generate" element={<GenerateImage />} />
        <Route path="/content/rewrite" element={<Rewrite />} />
      </Routes>
    </>
  );
}

export default App;
