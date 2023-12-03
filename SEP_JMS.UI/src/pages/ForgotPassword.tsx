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
import { commonForgot, commonLogin, customerLogin, employeeLogin } from "../api/Auth";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { commonRegex } from "../constants";


const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("customer");

  // custom hooks
  const currentCustomer = useCurrentCustomer();
  const currentEmployee = useCurrentEmployee();
  const currentPerson = useCurrentPerson();
  const snakeBar = useSnakeBar();
  const navigate = useNavigate();

  const handleSignIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    if (!username.trim() || !email.trim()) {
      snakeBar.setSnakeBar("Điền đầy đủ các trường!", "warning", true);
      return;
    }
    if (email?.trim() && !commonRegex.email.test(email)) {
      snakeBar.setSnakeBar("Email sai định dạng!", "warning", true);
      return;
    }
    setLoading(true);
    commonForgot(username, email)
      .then(data => {
        // currentCustomer.setCurrentCustomer?.(data);
        // currentEmployee.setCurrentEmployee?.(data);
        // currentPerson.setCurrentPerson?.(data);
        // localStorage.setItem("user", JSON.stringify(data));
        // window.dispatchEvent(new Event("storage"));
        snakeBar.setSnakeBar("Reset password thành công", "success", true);
      })
      .catch(err => {
        snakeBar.setSnakeBar("Có lỗi xảy ra! [" + err.response.data + "]", "error", true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="login h-screen bg-gradient-to-b from-[#0054a6] to-[#256fb9]">
      <div className="login_box absolute left-1/2 top-1/2 flex h-4/5 max-h-[600px] w-4/5 max-w-[500px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-lg bg-white shadow-lg lg:max-w-[900px]">
        <div className="left h-full w-full max-w-[500px] p-8 lg:w-2/5 lg:max-w-[900px]">
          <img src={Images.logo} width={100} className="absolute left-5 top-5" alt="" />
          <div className="contact flex h-full flex-col items-center justify-center gap-3">
            <form className="text-center">
              <h3 className="mb-8 select-none text-xl font-bold text-accent">Quên mật khẩu</h3>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                type="text"
                placeholder="Tên đăng nhập"
                className="mx-auto mb-4 w-4/5 border-b-2 border-slate-300 px-2 py-2 text-sm outline-none focus:border-[#0054a6] focus:outline-none"
              />
              <input
                autoComplete=""
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="mx-auto mb-4 w-4/5 border-b-2 border-slate-300 px-2 py-2 text-sm outline-none focus:border-[#0054a6] focus:outline-none"
              />
              {/* <FormControl
                size="small"
                className="mx-auto w-4/5 border-b-2 border-slate-300 text-sm outline-none focus:border-[#0054a6] focus:outline-none"
              >
                <Select
                  variant="standard"
                  sx={{
                    "& fieldset": { border: "2px solid rgb(203 213 225)" },
                    "&::before": { borderBottom: "2px solid rgb(203 213 225)" }
                  }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="p-2 text-left text-sm"
                >
                  <MenuItem className="text-sm" value={"customer"}>
                    Customer
                  </MenuItem>
                  <MenuItem className="text-sm" value={"employee"}>
                    Employee
                  </MenuItem>
                </Select>
              </FormControl>  */}
              <button
                onClick={handleSignIn}
                className="submit group relative mx-auto mb-2 mt-10 flex h-[44px] w-[145px] select-none items-center justify-center overflow-hidden rounded-md bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#29639e] focus:outline-none focus:ring-2 focus:ring-[#2765a3] focus:ring-opacity-50"
              >
                <div className="absolute -left-3 bottom-0 top-0 w-1 rotate-12 bg-[#fff] opacity-80 transition-all duration-300 group-hover:left-[calc(100%+10px)]"></div>
                <span className="absolute">Lấy lại mật khẩu</span>
              </button>
              {isLoading && <CircularProgress size={15} />}
              <br></br>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate(`/${PathString.DANG_NHAP}`)
                }}
              >
                Đăng nhập ?
              </Link>
            </form>
          </div>
        </div>
        <div className="right relative hidden h-full w-3/5 lg:block">
          <img
            className="h-full w-full object-cover"
            src={Images.signInBackground}
            alt=""
          />
          <div className="right-text absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-accent opacity-70"></div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
