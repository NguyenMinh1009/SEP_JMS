import React, { useState } from "react";
import Images from "../img";
import useCurrentCustomer from "../hooks/store/useCurrentCustomer";
import { FormControl, Link, MenuItem, Select } from "@mui/material";
import useSnakeBar from "../hooks/store/useSnakeBar";
import useCurrentEmployee from "../hooks/store/useCurrentEmployee";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { useNavigate } from "react-router-dom";
// API
import CircularProgress from "@mui/material/CircularProgress";
import { commonLogin, customerLogin, employeeLogin } from "../api/Auth";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import Hero from "../components/home/hero";
import Header from "../components/home/header";
import Footer from "../components/home/footer";
import HomeFeature from "../components/home/feature";


const LandingPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  

  return (
    <section >
      <Header></Header>
      <Hero></Hero>
      <HomeFeature></HomeFeature>
      <Footer></Footer>
    </section>
  );
};

export default LandingPage;
