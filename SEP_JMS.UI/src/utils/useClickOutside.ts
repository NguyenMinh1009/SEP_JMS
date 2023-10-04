import { useEffect } from "react";
export const useClickOutside = (ref: any, callback: () => void, customClass?: string) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.closest(".reply-btn")
      ) {
        callback();
      }

      if (ref.current && !ref.current.contains(event.target)) {
        if (customClass) {
          if (event.target.closest(customClass)) {
            callback();
          }
        } else {
          callback();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
