import { Routes, Route } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GenerateImage from "./pages/GenerateImage";
import Home from "./pages/Home";
import Rewrite from "./pages/Rewrite";
import ContentHistory from "./pages/ContentHistory";
import ImageHistory from "./components/ui/ImageHistory";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Nav from "./components/nav/Nav";
function App() {
  return (
    <>
      <ToastContainer transition={Flip} />
      {/* <Nav/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/image/generate" element={<ProtectedRoute><GenerateImage /></ProtectedRoute>} />
        <Route path="/content/rewrite" element={<Rewrite />} />
        <Route path="/content/history" element={<ContentHistory />} />
        <Route path="/image/history" element={<ImageHistory />} />
      </Routes>
    </>
  );
}

export default App;
