import { useRef, useState } from "react";
import Images from "../img";
import { cn } from "../utils/className";
import useCurrentPerson from "../hooks/store/useCurrentPerson";
import { Divider } from "@mui/material";
import { APIUrlHost, roleOptions } from "../constants";
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PathString } from "../enums/MapRouteToBreadCrumb";
import { useClickOutside } from "../utils/useClickOutside";
import useAvtRef from "../hooks/store/useCurrentAvatar";

const Avatar = () => {
  const [isExpand, setExpand] = useState<boolean>(false);
  const currentPerson = useCurrentPerson();
  const avtRef = useAvtRef();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    currentPerson.logout?.();
    // reset page when logout
    window.location.reload();
  };

  useClickOutside(panelRef, () => {
    setExpand(false);
  });

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative h-8 w-8 rounded-full border-[2px] transition-all",
        isExpand ? "border-accent" : "border-transparent"
      )}
    >
      <div
        onClick={() => {
          setExpand(!isExpand);
        }}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden transition-all",
          isExpand ? "h-6 w-6" : "h-8 w-8"
        )}
      >
        <img
          src={APIUrlHost + "/" + currentPerson.avatarUrl + "?t=" + avtRef.content ?? Images.avtPlaceHolder}
          className="h-full w-full rounded-full object-cover"
          alt=""
        />
      </div>
      <div
        onBlur={() => {
          setExpand(false);
        }}
        onClick={() => {
        }}
        className={cn(
          "absolute -right-1 top-full z-[10] w-60 origin-center translate-y-1 overflow-hidden rounded-md bg-white shadow-custom transition-all",
          isExpand ? "scale-1 opacity-100" : "pointer-events-none scale-0 opacity-0"
        )}
      >
        <div className="relative h-20 w-full bg-slate-500">
          <div className="absolute left-1/2 top-[10px] -translate-x-1/2">
            <p className="pb-2 pt-4 text-center text-xs text-white">
              {roleOptions.find(item => item.key === currentPerson.roleType)?.text}
            </p>
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <img src={APIUrlHost + "/" + currentPerson.avatarUrl + "?t=" + avtRef.content ?? Images.avtPlaceHolder} alt="" />
            </div>
          </div>
        </div>
        <div className="pt-10">
          <div className="mb-4 flex flex-col gap-1 text-center">
            <p className="text-secondary text-xs">{currentPerson.fullname}</p>
            <p className="text-secondary text-xs">{currentPerson.email}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p
              onClick={() => {
                navigate(`/${PathString.TAI_KHOAN}`);
                setExpand(false);
              }}
              className="cursor-pointer transition-all hover:opacity-60"
            >
              View Profile
            </p>
          </div>
          <Divider />
          <div>
            <div
              onClick={handleLogout}
              className="flex cursor-pointer items-center justify-center gap-3 justify-self-end whitespace-nowrap rounded-md p-3 transition-all hover:bg-slate-100"
            >
              <span className="text-secondary">Đăng xuất</span>
              <MdOutlineLogout />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
