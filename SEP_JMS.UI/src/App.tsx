import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import APIClientInstance from "./api/AxiosInstance";
import useSnakeBar from "./hooks/store/useSnakeBar";
import useCurrentPerson, { defaultPerson } from "./hooks/store/useCurrentPerson";

import jwt_decode from "jwt-decode";
import { Token } from "./interface/token";
import { Role } from "./enums/role";
import SignInSide from "./pages/SignIn";
import HomeSide from "./pages/Home";
import MainContent from "./components/MainContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { viVN } from "@mui/x-date-pickers";
import FinishedTasks from "./pages/FinishedTask";
import { PathString } from "./enums/MapRouteToBreadCrumb";
import TasksDetail from "./components/TaskDetail";
import Notifications from "./pages/Notifications";
import { recursiveStructuredClone } from "./utils/recursiveStructuredClone";
import FinishedProjects from "./pages/FinishedProject";
import Jobs from "./pages/Jobs";
import { CorrelationJobType } from "./enums/correlationJobType";
import EditTask from "./pages/EditTask";
import Home from "./pages/Home";
import CreateSubTask from "./components/ProjectManagement/SubTasks/CreateSubTask";
import SubTaskDetail from "./pages/SubTaskDetail";
import Profile from "./pages/profile";

const theme = createTheme(
  {
    typography: {
      fontFamily: ["Roboto", "san-serif"].join(",")
    }
  },
  viVN
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [localStorageUser, setLocalStorageUser] = useState<string | null>(
    localStorage.getItem("user")
  );

  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    snakeBar.setShow(false);
  };

  const handleStorageChange = () => {
    setLocalStorageUser(localStorage.getItem("user"));
  };

  const isTokenExpired = () => {
    if (!localStorageUser) return true;
    return jwt_decode<Token>(JSON.parse(localStorageUser).token).exp < Date.now() / 1000;
  };

  useEffect(() => {
    if (localStorageUser) {
      currentPerson.setCurrentPerson?.(JSON.parse(localStorageUser));
      APIClientInstance.defaults.headers.common["Authorization"] = JSON.parse(localStorageUser)
        .token
        ? "Bearer " + JSON.parse(localStorageUser).token
        : "";
    } else {
      currentPerson.setCurrentPerson?.(recursiveStructuredClone(defaultPerson));
      APIClientInstance.defaults.headers.common["Authorization"] = "";
    }
  }, [localStorageUser]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getSnakeColor: () => string = () => {
    switch (snakeBar.severity) {
      case "success":
        return "green";
      case "error":
        return "#ed1c35";
      case "warning":
        return "#feab00";
      case "info":
        return "#0054a6";
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snakeBar.isShow}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snakeBar.severity}
          sx={{
            width: "100%",
            fontSize: "12px",
            fontFamily: "Roboto, san-serif",
            fontWeight: "500",
            lineHeight: "20px",
            backgroundColor: "#fff",
            color: getSnakeColor()
          }}
        >
          {snakeBar.message}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {!localStorageUser || !JSON.parse(localStorageUser).userId || isTokenExpired() ? (
            <Routes>
              <Route path={`/${PathString.DANG_NHAP}`} element={<SignInSide />} />
              <Route path="*" element={<Navigate to={`/${PathString.DANG_NHAP}`} />} />
            </Routes>
          ) : (
            <div className={`//max-w-[1700px] relative mx-auto`}>
              <Routes>
                <Route element={<MainContent />}>
                  {/* route create task */}
                  <Route
                    path={`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}/${PathString.THEM_MOI}`}
                    element={<Home isCorrelationJobType={CorrelationJobType.Project} />}
                  />
                  <Route
                    path={`/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}/${PathString.THEM_MOI}`}
                    element={<Home isCorrelationJobType={CorrelationJobType.Job} />}
                  />
                  <Route
                    path={`/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}/${PathString.THEM_MOI}`}
                    element={<Home isCorrelationJobType={CorrelationJobType.Project} />}
                  />
                  <Route
                    path={`/${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}/${PathString.THEM_MOI}`}
                    element={<Home isCorrelationJobType={CorrelationJobType.Job} />}
                  />
                  {JSON.parse(localStorageUser).roleType !== Role.CUSTOMER && (
                    <>
                      <Route
                        path={`/${PathString.NOI_BO}/${PathString.VIEC_DU_AN}/${PathString.THEM_MOI}`}
                        element={
                          <Home isInternal isCorrelationJobType={CorrelationJobType.Project} />
                        }
                      />
                      <Route
                        path={`/${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}/${PathString.THEM_MOI}`}
                        element={<Home isInternal isCorrelationJobType={CorrelationJobType.Job} />}
                      />
                    </>
                  )}
                  <Route path={`/${PathString.THONG_BAO}`} element={<Notifications />} />
                  <Route path={`/${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}*`}>
                    <Route index element={<Jobs isCorrelationJobType={CorrelationJobType.Job} />} />
                    {/* <Route path=":taskId"> */}
                    <Route
                      path=":taskId"
                      element={<TasksDetail isCorrelationJobType={CorrelationJobType.Job} />}
                    />

                    {/* </Route> */}

                    <Route path={`:taskId/${PathString.CHINH_SUA}`} element={<EditTask />} />
                  </Route>
                  <Route path={`/${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}*`}>
                    <Route
                      index
                      element={<Jobs isCorrelationJobType={CorrelationJobType.Project} />}
                    />
                    <Route
                      path=":taskId"
                      element={<TasksDetail isCorrelationJobType={CorrelationJobType.Project} />}
                    />
                    <Route path={`:taskId/${PathString.CHINH_SUA}`} element={<EditTask />} />

                    {/* subtask route */}
                    {/* <Route
                      path={`:taskId/${PathString.VIEC_DU_AN}/:subTaskId`}
                      element={<SubTaskDetail />}
                    />
                    <Route
                      path={`:taskId/${PathString.THEM_MOI_CONG_VIEC_DU_AN}`}
                      element={<Home isCorrelationJobType={CorrelationJobType.Job} isParentId />}
                    /> */}
                  </Route>
                  <Route path={`/${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}*`}>
                    <Route index element={<FinishedTasks />} />
                    <Route
                      path=":taskId"
                      element={
                        <TasksDetail finishOnly isCorrelationJobType={CorrelationJobType.Job} />
                      }
                    />
                    <Route path={`:taskId/${PathString.CHINH_SUA}`} element={<EditTask />} />
                  </Route>
                  <Route path={`/${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}*`}>
                    <Route index element={<FinishedProjects />} />
                    <Route
                      path=":taskId"
                      element={
                        <TasksDetail finishOnly isCorrelationJobType={CorrelationJobType.Project} />
                      }
                    />
                    <Route path={`:taskId/${PathString.CHINH_SUA}`} element={<EditTask />} />

                    <Route
                      path={`:taskId/${PathString.VIEC_CUA_DU_AN}/:subTaskId`}
                      element={<SubTaskDetail />}
                    />
                    <Route
                      path={`:taskId/${PathString.THEM_MOI_CONG_VIEC_DU_AN}`}
                      element={<Home isCorrelationJobType={CorrelationJobType.Job} isParentId />}
                    />
                  </Route>
                  <Route path={`/${PathString.TAI_KHOAN}`} element={<Profile />} />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={
                          JSON.parse(localStorageUser).roleType === Role.CUSTOMER
                            ? `/${PathString.CONG_KHAI}`
                            : `/${PathString.THONG_BAO}`
                        }
                      />
                    }
                  />
                </Route>
              </Routes>
            </div>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
