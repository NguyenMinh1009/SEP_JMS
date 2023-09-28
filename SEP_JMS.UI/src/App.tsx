import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./pages/SignIn";
import HomeSide from "./pages/Home";
import MainContent from "./components/MainContent";
import { createTheme } from "@mui/material";
import { viVN } from "@mui/x-date-pickers";

const theme = createTheme(
  {
    typography: {
      fontFamily: ["Roboto", "san-serif"].join(",")
    }
  },
  viVN
);
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInSide />} />
        </Routes>
        <Routes>
          <Route element={<MainContent />}>
            <Route path="/home" element={<HomeSide />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
