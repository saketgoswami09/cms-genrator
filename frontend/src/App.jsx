import { Routes, Route } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GenerateImage from "./pages/GenerateImage";
function App() {
  return (
    <>
      <ToastContainer transition={Flip} />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/image/generate" element={<GenerateImage />} />
      </Routes>
    </>
  );
}

export default App;
