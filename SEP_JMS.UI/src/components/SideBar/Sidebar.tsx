import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useSideBarPanel from "../../hooks/store/useSideBarPanel";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { BiBell, BiListUl, BiLockAlt } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { PiUsersThreeLight } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { BsCheckAll } from "react-icons/bs";
import Images from "../../img";
import { Role } from "../../enums/role";
import { PathString } from "../../enums/MapRouteToBreadCrumb";

//-------------
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { AiOutlineArrowRight } from "react-icons/ai";
import { TiThMenuOutline } from "react-icons/ti";
import { recursiveStructuredClone } from "../../utils/recursiveStructuredClone";
import APIClientInstance from "../../api/AxiosInstance";
import { MdOutlineAttachMoney } from "react-icons/md";
//-------------
interface ISidebarItem {
  parent: {
    text: string;
    to: string;
    Icon: React.ReactElement<any, any>;
    prefix: string;
    items?: ISidebarItem[];
  };
  children?: {
    text: string;
    to: string;
  }[];
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const SideBar = () => {
  const [selectedParentTab, setSelectedParentTab] = React.useState<string>("Trang chủ");
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  const navigate = useNavigate();
  const location = useLocation();

  const currentPerson = useCurrentPerson();
  const sidebar = useSideBarPanel();
  const [nestedOpenArr, setNestedOpenArr] = React.useState<boolean[]>([]);
  const [hasNewNotification, setHasNewNotification] = React.useState<number>(0);

  const handleNestedsClick = (index: number) => {
    const clone = recursiveStructuredClone(nestedOpenArr);
    clone[index] = !clone[index];
    setNestedOpenArr(clone);
  };

  const handleOpenDrawer = () => {
    sidebar.setExpand(!sidebar.isExpand);
  };

  const sidebarCommonItems: ISidebarItem[] =
    currentPerson.roleType !== Role.CUSTOMER
      ? [
        {
          parent: {
            text: "Duyệt nội bộ",
            to: `#nested`,
            Icon: <BiLockAlt size={18} />,
            prefix: `${PathString.NOI_BO}`,
            items: [
              {
                parent: {
                  text: "Việc dự án",
                  to: `${PathString.NOI_BO}/${PathString.VIEC_DU_AN}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_DU_AN}`
                }
              },
              {
                parent: {
                  text: "Việc hàng ngày",
                  to: `${PathString.NOI_BO}/${PathString.VIEC_HANG_NGAY}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_HANG_NGAY}`
                }
              }
            ]
          }
        },
        {
          parent: {
            text: "Chờ khách duyệt",
            to: `#nested`,
            Icon: <BiListUl size={18} />,
            prefix: `${PathString.CONG_KHAI}`,
            items: [
              {
                parent: {
                  text: "Việc dự án",
                  to: `${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_DU_AN}`
                }
              },
              {
                parent: {
                  text: "Việc hàng ngày",
                  to: `${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_HANG_NGAY}`
                }
              }
            ]
          }
        },
        {
          parent: {
            text: "Việc đã xong",
            to: `#nested`,
            Icon: <BsCheckAll size={18} />,
            prefix: `${PathString.VIEC_DA_XONG}`,
            items: [
              {
                parent: {
                  text: "Việc dự án",
                  to: `${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_DU_AN}`
                }
              },
              {
                parent: {
                  text: "Việc hàng ngày",
                  to: `${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_HANG_NGAY}`
                }
              }
            ]
          }
        }
      ]
      : [
        {
          parent: {
            text: "Việc đang làm",
            to: `#nested`,
            Icon: <BiListUl size={18} />,
            prefix: `${PathString.CONG_KHAI}`,
            items: [
              {
                parent: {
                  text: "Việc dự án",
                  to: `${PathString.CONG_KHAI}/${PathString.VIEC_DU_AN}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_DU_AN}`
                }
              },
              {
                parent: {
                  text: "Việc hàng ngày",
                  to: `${PathString.CONG_KHAI}/${PathString.VIEC_HANG_NGAY}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_HANG_NGAY}`
                }
              }
            ]
          }
        },
        {
          parent: {
            text: "Việc đã xong",
            to: `#nested`,
            Icon: <BsCheckAll size={18} />,
            prefix: `${PathString.VIEC_DA_XONG}`,
            items: [
              {
                parent: {
                  text: "Việc dự án",
                  to: `${PathString.VIEC_DA_XONG}/${PathString.VIEC_DU_AN}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_DU_AN}`
                }
              },
              {
                parent: {
                  text: "Việc hàng ngày",
                  to: `${PathString.VIEC_DA_XONG}/${PathString.VIEC_HANG_NGAY}`,
                  Icon: <AiOutlineArrowRight size={18} className="opacity-90" />,
                  prefix: `${PathString.VIEC_HANG_NGAY}`
                }
              }
            ]
          }
        }
      ];

  const sidebarDetailItems: ISidebarItem[] =
    currentPerson.roleType === Role.ADMIN
      ? [
        {
          parent: {
            text: "Thông báo",
            to: `${PathString.THONG_BAO}`,
            Icon: <BiBell size={18} />,
            prefix: `${PathString.THONG_BAO}`
          }
        },
        {
          parent: {
            text: "Quản lý users",
            to: `${PathString.USERS}`,
            Icon: <PiUsersThreeLight size={18} />,
            prefix: `${PathString.USERS}`
          }
        },
        {
          parent: {
            text: "Quản lý giá",
            to: `${PathString.PRICES}`,
            Icon: <IoPricetagsOutline size={18} />,
            prefix: `${PathString.PRICES}`
          }
        },
        {
          parent: {
            text: "Thống kê",
            to: `${PathString.REPORT}`,
            Icon: <TbReport size={18} className="opacity-90" />,
            prefix: `${PathString.REPORT}`
          }
        }
        // {
        //   parent: {
        //     text: "Tài khoản",
        //     to: `${PathString.TAI_KHOAN}`,
        //     Icon: <BiUser size={18} />,
        //     prefix: `${PathString.TAI_KHOAN}`
        //   }
        // }
      ]
      : (currentPerson.roleType === Role.ACCOUNT || (currentPerson.roleType === Role.CUSTOMER && !currentPerson.hiddenPrice))
        ? [
          {
            parent: {
              text: "Thông báo",
              to: `${PathString.THONG_BAO}`,
              Icon: <BiBell size={18} />,
              prefix: `${PathString.THONG_BAO}`
            }
          },
          {
            parent: {
              text: "Bảng giá",
              to: `${PathString.VIEW_PRICES}`,
              Icon: <MdOutlineAttachMoney size={18} />,
              prefix: `${PathString.VIEW_PRICES}`
            }
          }
        ]
        : [
          {
            parent: {
              text: "Thông báo",
              to: `${PathString.THONG_BAO}`,
              Icon: <BiBell size={18} />,
              prefix: `${PathString.THONG_BAO}`
            }
          }
        ];

  const sidebarItems = [
    {
      title: "Công việc",
      content: sidebarCommonItems
    },
    {
      title: "Báo cáo",
      content: sidebarDetailItems
    }
  ];

  const getSelectedBackgroundColor = (item: string): string => {
    return selectedParentTab === item ? "bg-third" : "";
  };

  const handleClickListItem = (contentItem: ISidebarItem) => {
    setSelectedParentTab(contentItem.parent.text);
    if (contentItem.parent.to) navigate(contentItem.parent.to);
  };

  const getSelectedBorderStyle = (item: string): JSX.Element => {
    return selectedParentTab === item ? (
      <div className="absolute right-0 top-0 h-full w-1 translate-x-1/2 rounded-sm bg-accent"></div>
    ) : (
      <></>
    );
  };

  const renderSideBarTitle = (title: string) => {
    if (sidebar.isExpand) {
      // if (currentPerson.roleType === Role.ADMIN || title !== "Báo cáo")
      if (1 === 1) return <p className="text-secondary px-10">{title}</p>;
      return <></>;
    }
    return <></>;
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      APIClientInstance.post("notification", {
        pageIndex: 1,
        pageSize: 10,
        status: "unread"
      }).then(res => {
        setHasNewNotification(res.data.item1);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    // Update screen width state on window resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    // if (screenWidth < 1500 && sidebar.isExpand) sidebar.setExpand(false);
  }, [screenWidth]);

  React.useEffect(() => {
    const currentDetailTab = [...sidebarCommonItems, ...sidebarDetailItems].find(item =>
      location.pathname.includes(item.parent.prefix)
    );
    if (currentDetailTab) {
      setSelectedParentTab(currentDetailTab.parent.text);
    }
  }, [location.pathname, currentPerson.roleType]);

  return (
    <div
      className={`${sidebar.isExpand ? "w-[320px]" : "w-[66px]"} absolute left-0 top-0 bg-white`}
    >
      <Box className="h-screen border-r-[1px] border-[rgba(0,0,0,0.12)] transition-all">
        {/* sidebar header */}
        <DrawerHeader
          className={`flex min-h-[75px] border-solid ${sidebar.isExpand ? "justify-between px-10 pr-4" : "justify-center"
            } mb-2`}
        >
          <Box
            className={`flex items-center justify-center gap-4 ${sidebar.isExpand ? "" : "hidden"}`}
          >
            {/* logo */}
            <img
              onClick={() => {
                if (currentPerson.roleType !== Role.CUSTOMER) navigate(`${PathString.NOI_BO}`);
                else {
                  navigate(`${PathString.CONG_KHAI}`);
                }
              }}
              src={Images.logo}
              className="w-28 cursor-pointer transition-all hover:opacity-70"
              alt=""
            />
          </Box>
          <IconButton
            className={``}
            // disabled={screenWidth < 1500}
            onClick={
              screenWidth < 1500
                ? () => {
                  if (currentPerson.roleType !== Role.CUSTOMER) navigate(`${PathString.NOI_BO}`);
                  else {
                    navigate(`${PathString.CONG_KHAI}`);
                  }
                }
                : handleOpenDrawer
            }
          >
            {sidebar.isExpand ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>

        {/* navigation tabs */}
        {sidebarItems.map((item, pIdx) => {
          if (item.content.length > 0)
            return (
              <div key={item.title}>
                {renderSideBarTitle(item.title)}
                <List className="mb-6">
                  {item.content.map((contentItem, _index) =>
                    contentItem.parent.to !== "#nested" ? (
                      <ListItem
                        className={`group relative py-0 ${sidebar.isExpand ? "flex flex-col items-start px-8" : "justify-center"
                          }`}
                        key={contentItem.parent.text}
                      >
                        <ListItemButton
                          onClick={() => handleClickListItem(contentItem)}
                          // title={contentItem.parent.text}
                          className={`relative w-full items-center overflow-hidden rounded-md ${sidebar.isExpand ? "justify-start pl-7 pr-4" : "justify-center px-5"
                            } ${getSelectedBackgroundColor(contentItem.parent.text)}`}
                        >
                          <ListItemIcon
                            className={`mb-[2px] min-w-0 items-center justify-center transition-all ${sidebar.isExpand ? "mr-4" : "auto"
                              } text-[#334155]`}
                          >
                            <div className="relative flex items-center justify-center">
                              {contentItem.parent.Icon}
                              {contentItem.parent.to === `${PathString.THONG_BAO}` && hasNewNotification > 0 && (
                                <div
                                  className={`absolute right-0 top-0 flex -translate-y-[2px] items-center justify-center rounded-full bg-accent  p-1 text-xs font-semibold text-white`}
                                />
                              )}
                            </div>
                          </ListItemIcon>
                          <ListItemText
                            className={`${sidebar.isExpand ? "" : "hidden"
                              } text-primary font-semibold transition-all [&>span]:text-[13px] [&>span]:font-[500]`}
                            primary={contentItem.parent.text}
                          />
                        </ListItemButton>
                        {getSelectedBorderStyle(contentItem.parent.text)}
                        {!sidebar.isExpand && (
                          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-[20] flex w-0 items-center justify-start overflow-hidden border-y border-accent bg-white shadow-md transition-all group-hover:w-40 group-hover:pl-5">
                            {contentItem.parent.text}
                          </div>
                        )}
                      </ListItem>
                    ) : (
                      <React.Fragment key={contentItem.parent.text + "-sub"}>
                        <ListItem
                          className={`group relative py-0 ${sidebar.isExpand ? "flex flex-col items-start px-8" : "justify-center"
                            }`}
                          key={contentItem.parent.text}
                        >
                          <ListItemButton
                            onClick={() => handleNestedsClick(_index)}
                            // title={contentItem.parent.text}
                            className={`relative w-full items-center overflow-hidden rounded-md ${sidebar.isExpand ? "justify-start pl-7 pr-4" : "justify-center px-5"
                              } ${getSelectedBackgroundColor(contentItem.parent.text)}`}
                          >
                            <ListItemIcon
                              className={`mb-[2px] min-w-0 items-center justify-center transition-all ${sidebar.isExpand ? "mr-4" : "auto"
                                } text-[#334155]`}
                            >
                              <div className="relative flex items-center justify-center">
                                {contentItem.parent.Icon}
                              </div>
                            </ListItemIcon>
                            <ListItemText
                              className={`${sidebar.isExpand ? "" : "hidden"
                                } text-primary font-semibold transition-all [&>span]:text-[13px] [&>span]:font-[500]`}
                              primary={contentItem.parent.text}
                            />
                            {nestedOpenArr[_index] ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          {getSelectedBorderStyle(contentItem.parent.text)}
                          {!sidebar.isExpand && (
                            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-[20] flex w-0 items-center justify-start overflow-hidden border-y border-accent bg-white shadow-md transition-all group-hover:w-40 group-hover:pl-5">
                              {contentItem.parent.text}
                            </div>
                          )}
                        </ListItem>
                        <Collapse in={nestedOpenArr[_index]} timeout="auto" unmountOnExit>
                          <List component="div">
                            {contentItem.parent.items?.map(
                              (subItem, _rIdx) =>
                                subItem && (
                                  <ListItem
                                    className={`group relative py-0 ${sidebar.isExpand
                                        ? "flex flex-col items-start px-8"
                                        : "justify-center"
                                      }`}
                                    key={subItem.parent.text}
                                  >
                                    <ListItemButton
                                      onClick={() => handleClickListItem(subItem)}
                                      // title={contentItem.parent.text}
                                      className={`relative w-full items-center overflow-hidden rounded-md ${sidebar.isExpand
                                          ? "justify-start pl-7 pr-4"
                                          : "justify-center px-5"
                                        } ${getSelectedBackgroundColor(subItem.parent.text)}`}
                                    >
                                      <ListItemIcon
                                        className={`mb-[2px] min-w-0 items-center justify-center transition-all ${sidebar.isExpand ? "mr-4" : "auto"
                                          } text-[#334155]`}
                                      >
                                        <div className="relative flex items-center justify-center">
                                          {subItem.parent.Icon}
                                          {subItem.parent.to === `${PathString.THONG_BAO}` && (
                                            <div
                                              className={`absolute right-0 top-0 flex -translate-y-[2px] items-center justify-center rounded-full bg-accent  p-1 text-xs font-semibold text-white`}
                                            />
                                          )}
                                        </div>
                                      </ListItemIcon>
                                      <ListItemText
                                        className={`${sidebar.isExpand ? "" : "hidden"
                                          } text-primary font-semibold transition-all [&>span]:text-[13px] [&>span]:font-[500]`}
                                        primary={subItem.parent.text}
                                      />
                                    </ListItemButton>
                                    {getSelectedBorderStyle(subItem.parent.text)}
                                    {!sidebar.isExpand && (
                                      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-[20] flex w-0 items-center justify-start overflow-hidden border-y border-accent bg-white shadow-md transition-all group-hover:w-40 group-hover:pl-5">
                                        {subItem.parent.text}
                                      </div>
                                    )}
                                  </ListItem>
                                )
                            )}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    )
                  )}
                </List>
              </div>
            );
          else return <></>;
        })}
      </Box>
    </div>
  );
};

export default SideBar;
