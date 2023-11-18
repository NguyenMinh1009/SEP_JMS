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


const _404Page: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("customer");

  // custom hooks
  const currentCustomer = useCurrentCustomer();
  const currentEmployee = useCurrentEmployee();
  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();
  const navigate = useNavigate()

  return (
    <div id="main-error">
      <div className="fof">
        <h1>Error 404</h1>
      </div>
    </div>
  );
};

export default _404Page;
