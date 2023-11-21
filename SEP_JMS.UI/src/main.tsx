import ReactDOM from "react-dom/client";
import "./index.css";
import { StyledEngineProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, viVN } from "@mui/x-date-pickers";
import AppFx from "./AppFx";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <LocalizationProvider
      localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
      dateAdapter={AdapterMoment}
    >
      <AppFx />
    </LocalizationProvider>
  </StyledEngineProvider>
  // </React.StrictMode>
);
