import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./pages/SignIn";
import HomeSide from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInSide />} />
          <Route path="/home" element={<HomeSide />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
