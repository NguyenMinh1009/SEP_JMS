import mime from "mime";
import AlwayxInstance from "../api/AxiosInstance";
import { PostType } from "../enums/postType";
import { ITitle } from "../hooks/store/useCurrentTitle";
import { FileResponse } from "../interface/fileResponse";
import { JobStatusType } from "../enums/jobStatusType";
import { InternalJobStatusType } from "../enums/internalJobStatusType";

export const getTaskDetails = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setImagesLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTaskDetail: React.Dispatch<any>,
  breadCrumbTitle: ITitle,
  setDocFiles: React.Dispatch<React.SetStateAction<FileResponse[]>>,
  setImgFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  endPoint: string,
  imgEndPoint: string
) => {
  setLoading(true);
  const res = await AlwayxInstance.get(endPoint);
  setTaskDetail(res.data);
  setLoading(false);
  if (
    (res.data.jobStatus === JobStatusType.Completed ||
      res.data.internalJobStatus === InternalJobStatusType.Completed) &&
    (!res.data.previewProducts || res.data?.previewProducts?.files?.length === 0)
  ) {
    setOpenDialog(true);
  }
  breadCrumbTitle.setContent(res.data?.title);
  const requirementList: FileResponse[] = res.data?.requirements?.files;

  if (requirementList && requirementList.length > 0) {
    const docList = requirementList.filter(list => !mime.getType(list.fileName)?.includes("image"));
    setDocFiles(docList);
    const imgList: FileResponse[] = [];
    requirementList.forEach((item: any) => {
      if (mime.getType(item.fileName)?.includes("image")) imgList.push(item);
    });
    setImagesLoading(true);
    for (const img of imgList) {
      const response = await AlwayxInstance.post(
        imgEndPoint,
        {
          fileName: img.fileName,
          postsType: PostType.post
        },
        { responseType: "blob" }
      );
      const newImg = new File([response.data], img.originalName, { type: response.data.type });
      setImgFiles(prev => [newImg, ...prev]);
    }
    setImagesLoading(false);
  }
};
