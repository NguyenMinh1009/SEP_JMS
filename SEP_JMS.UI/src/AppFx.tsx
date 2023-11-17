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
// import SubTaskDetail from "./pages/SubTaskDetail";
import Profile from "./pages/profile";
import ForgotPassword from "./pages/ForgotPassword";
import UsersPage from "./pages/Users";
import CreateCompany from "./pages/CreateCompany";
import CreateCustomer from "./pages/CreateCustomer";
import CreateEmployee from "./pages/CreateEmployee";
import EditCompany from "./pages/EditCompany";
import EditCustomer from "./pages/EditCustomer";
import EditEmployee from "./pages/EditEmployee";
import InternalTasksDetail from "./components/InternalTaskDetail";
import SubTaskDetail from "./components/ProjectManagement/SubTasks/SubTaskDetail";
import InternalSubTasksDetail from "./components/ProjectManagement/SubTasks/InternalSubTaskDetail";
import CreatePriceGroups from "./pages/CreatePriceGroups";
import EditPriceGroup from "./pages/EditPriceGroup";
import PricesPage from "./pages/Prices";
import PriceList from "./pages/PriceList";
import EditTypeOfJobs from "./pages/EditTypeOfJobs";
import ReportPage from "./pages/ReportPage";
import LandingPage from "./pages/Landing";
import _401Page from "./pages/401Page";
import _404Page from "./pages/404Page";

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

interface RouteRule {
  path: string;
  roles?: Role[];
  element: any;
  sub_routes?: RouteRule[]
}

const PathRules: RouteRule[] = [
  // guest
  {
    path: PathString.HOMEPAGE,
    roles: [Role.GUEST],
    element: <LandingPage />
  },
  {
    path: PathString.DANG_NHAP,
    roles: [Role.GUEST],
    element: <SignInSide />
  },
  {
    path: PathString.QUEN_MAT_KHAU,
    roles: [Role.GUEST],
    element: <ForgotPassword />
  },
  // auth - all

  {
    path: PathString.TAI_KHOAN,
    roles: [Role.HAS_AUTH],
    element: <Profile />
  },
  {
    path: PathString.THONG_BAO,
    roles: [Role.HAS_AUTH],
    element: <Notifications />
  },
  // for admin
  {
    path: `${PathString.USERS}/*`,
    roles: [Role.ADMIN],
    element: <UsersPage />,
    sub_routes: [
      {
        path: `${PathString.CREATE_COMPANY}`,
        element: <CreateCompany />,
      },
      {
        path: `${PathString.CREATE_CUSTOMER}`,
        element: <CreateCustomer />,
      },
      {
        path: `${PathString.CREATE_EMPLOYEE}`,
        element: <CreateEmployee />,
      },
      {
        path: `${PathString.KHACH_HANG}/:userId/${PathString.CHINH_SUA}`,
        element: <EditCustomer />,
      },
      {
        path: `${PathString.COMPANY}/:companyId/${PathString.CHINH_SUA}`,
        element: <EditCompany />,
      },
      {
        path: `${PathString.NHAN_VIEN}/:userId/${PathString.CHINH_SUA}`,
        element: <EditEmployee />,
      },
    ]
  },
  {
    path: `${PathString.PRICES}/*`,
    roles: [Role.ADMIN],
    element: <PricesPage />,
    sub_routes: [
      {
        path: `${PathString.THEM_MOI}`,
        element: <CreatePriceGroups />,
      },
      {
        path: `${PathString.TYPEOFJOBS}`,
        element: <EditTypeOfJobs />,
      },
      {
        path: `:priceGroupId`,
        element: <PriceList />,
      },
      {
        path: `:priceGroupId/${PathString.CHINH_SUA}`,
        element: <EditPriceGroup />,
      },
    ]
  },
  {
    path: `${PathString.REPORT}/*`,
    roles: [Role.ADMIN],
    element: <ReportPage />
  }
]

function AppFx() {
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

  const isAuth = () => {
    return !(!localStorageUser || !JSON.parse(localStorageUser).userId || isTokenExpired());
  }

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
          <Routes>
            {PathRules.map((e) => {
              const currentRole = !localStorageUser || !JSON.parse(localStorageUser).userId || isTokenExpired() ? Role.GUEST : JSON.parse(localStorageUser).roleType;
              // access
              if (e.roles?.includes(currentRole) || currentRole !== Role.GUEST && e.roles?.includes(Role.HAS_AUTH)) {
                if (currentRole === Role.GUEST) {
                  return (<Route path={`/${e.path}`} element={e.element} />)
                } else {
                  console.log(e.sub_routes);

                  return (
                    <Route element={<MainContent />}>
                      {
                        !e.path.includes("*") ?
                          (
                            <Route
                              path={`/${e.path}`}
                              element={e.element}
                            />
                          ) : (
                            <Route path={`/${e.path}`}>
                              <Route index element={e.element} />
                              {e.sub_routes?.map(se =>
                              (
                                <Route
                                  path={`${se.path}`}
                                  element={se.element}
                                />
                              )

                              )}
                            </Route>
                          )
                      }

                    </Route>
                  )

                }
              }
              // not access and auth
              if (!isAuth()||e.roles?.includes(Role.GUEST))
                return (
                  <Route
                    path={`/${e.path}`}
                    element={
                      <Navigate
                        to={
                          `/`
                        }
                      />
                    }
                  />
                )
              else return (<Route path={`/${e.path}`} element={<_401Page />} />)
            })}
            <Route
              path="/"
              element={
                !localStorageUser || JSON.parse(localStorageUser ?? "").roleType === Role.GUEST ?
                  <LandingPage />
                  : <Navigate
                    to={
                      `/${PathString.THONG_BAO}`
                    }
                  />
              }
            />
            <Route
              path="*"
              element={
                <_404Page />
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default AppFx;
