import { useEffect } from "react";
import AlwayxInstance from "../api/AxiosInstance";

const Notifications = () => {
	useEffect(() => {
		const getNotification = async () => {
			const notifications = (
				await AlwayxInstance.post("/notification/all", {
					pageIndex: 1,
					pageSize: 2147483647,
					type: 2,
				})
			).data;
		};
		getNotification();
	}, []);
	return <div>Notifications</div>;
};

export default Notifications;
