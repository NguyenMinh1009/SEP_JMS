import APIClientInstance from "../AxiosInstance";

export const customerLogin = async (username: string, password: string): Promise<any> => {
	return APIClientInstance.post("auth/customer/login", {
		username,
		password,
	}).then(res => res.data);
};

export const employeeLogin = async (username: string, password: string): Promise<any> => {
	return APIClientInstance.post("auth/employee/login", {
		username,
		password,
	}).then((res) => res.data);
};

export const commonLogin = async (username: string, password: string): Promise<any> => {
	return APIClientInstance.post("user/login", {
		username,
		password,
	}).then((res) => res.data);
};