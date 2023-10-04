import AlwayxInstance from "../AxiosInstance";

export const postFileUpload = async (formData: FormData): Promise<any> => {
	return AlwayxInstance.post("file/requirement/upload", formData)
		.then((res) => res.data)
		.catch((err) => err);
};

export const postFileComment = async (formData: FormData): Promise<any> => {
	return AlwayxInstance.post("file/comment/upload", formData)
		.then((res) => res.data)
		.catch((err) => err);
};
