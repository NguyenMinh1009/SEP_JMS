import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import useTitle from "../../hooks/store/useCurrentTitle";
import { PathString } from "../../enums/MapRouteToBreadCrumb";
import { Role } from "../../enums/role";

const BreadCrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPerson = useCurrentPerson();
  const breadCrumbTitle = useTitle();
  const { taskId, priceGroupId, userId, companyId } = useParams();
  const idUnClickableParamList = [userId, companyId];
  const idClickableParamList = [taskId, priceGroupId];
  const routeList = location.pathname.split("/").slice(1);

  const breadCrumb = [
    {
      key: PathString.NOI_BO,
      value: "Duyệt nội bộ",
      prefix: "task",
      clickable: true
    },
    {
      key: PathString.CONG_KHAI,
      value: currentPerson.roleType === Role.CUSTOMER ? "Việc đang làm" : "Chờ khách duyệt",
      prefix: "task",
      clickable: false
    },
    {
      key: PathString.VIEC_DU_AN,
      value: "Việc dự án",
      prefix: "task",
      clickable: true
    },
    {
      key: PathString.VIEC_HANG_NGAY,
      value: "Việc hàng ngày",
      prefix: "task",
      clickable: true
    },
    {
      key: PathString.VIEC_DA_XONG,
      value: "Việc đã xong",
      prefix: "task",
      clickable: false
    },
    {
      key: PathString.THEM_MOI,
      value: "Thêm mới",
      prefix: "task",
      clickable: true
    },
    {
      key: PathString.THONG_BAO,
      value: "Thông báo",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.TAI_KHOAN,
      value: "Tài khoản",
      prefix: "center",
      clickable: true
    },
    {
      key: PathString.CHINH_SUA,
      value: "Chỉnh sửa",
      prefix: "task",
      clickable: true
    },
    {
      key: PathString.USERS,
      value: "Quản lý users",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.PRICES,
      value: "Quản lý giá",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.TYPEOFJOBS,
      value: "Loại thiết kế",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.CREATE_COMPANY,
      value: "Tạo mới company",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.CREATE_CUSTOMER,
      value: "Tạo mới khách hàng",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.CREATE_EMPLOYEE,
      value: "Tạo mới nhân viên",
      prefix: "report",
      clickable: true
    },
    {
      key: PathString.COMPANY,
      value: "Company",
      prefix: "report",
      clickable: false
    },
    {
      key: PathString.KHACH_HANG,
      value: "Khách hàng",
      prefix: "report",
      clickable: false
    },
    {
      key: PathString.NHAN_VIEN,
      value: "Nhân viên",
      prefix: "report",
      clickable: false
    },
    {
      key: PathString.REPORT,
      value: "Thống kê",
      prefix: "report",
      clickable: false
    }
  ];

  const shouldRenderTitle = (path: string) => {
    return [...idUnClickableParamList, ...idClickableParamList].includes(path);
  };

  const getPrefixForBreadCrumb = (): string => {
    var _prx = breadCrumb.find(({ key }) => key === routeList[0])?.prefix 
    if (_prx === "task") return "Công việc"
    if (_prx === "report") return "Báo cáo"
    return "Trung tâm"
  };

  const getRouteFromBreadCrumb = (path: string): string => {
    const routeIndex = routeList.findIndex(item => item === path);
    if (routeIndex !== undefined && routeIndex > -1) {
      const newRouteList = routeList.slice(0, routeIndex + 1);
      return "/" + newRouteList.join("/");
    }
    return "";
  };

  const getBreadCrumbText = (path: string, _index: number): string => {
    const crumbItem = breadCrumb.find(({ key }) => key === path);
    const preFix: string = " > ";
    return preFix + (shouldRenderTitle(path) ? breadCrumbTitle.content : crumbItem?.value);
  };

  useEffect(() => {
    if (routeList.every(item => !shouldRenderTitle(item))) breadCrumbTitle.clear();
  }, [location.pathname]);

  return (
    <div className="flex max-w-[550px] items-center">
      <span className="text-secondary mr-1 whitespace-nowrap">{getPrefixForBreadCrumb()}</span>
      {routeList.map((path, index) => {
        const isClickable =
          breadCrumb.find(item => item.key === path)?.clickable ||
          (!idUnClickableParamList.includes(path) && idClickableParamList.includes(path));
        return (
          <span
            key={path}
            onClick={() => {
              if (isClickable) navigate(getRouteFromBreadCrumb(path));
            }}
            className={`mr-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap ${
              index !== routeList.length - 1 ? "text-secondary" : "text-primary"
            } ${isClickable ? "cursor-pointer" : ""}`}
          >
            {getBreadCrumbText(path, index)}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
