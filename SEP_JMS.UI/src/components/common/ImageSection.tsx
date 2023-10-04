import React, { useEffect, useState } from "react";

import { RiCloseCircleFill } from "react-icons/ri";
import { createResizedImage } from "../../utils/Resizer";

interface IImageSectionProps {
  imgFiles: File[];
  handleDelete?: (name: string) => void;
}

const ImageSection: React.FC<IImageSectionProps> = ({ imgFiles, handleDelete }) => {
  const resizeFile = (file: File): Promise<any> =>
    new Promise(resolve => {
      createResizedImage(
        file,
        300,
        300,
        "WEBP",
        100,
        0,
        uri => {
          resolve(uri);
        },
        "base64"
      );
    });
  const [resizedImages, setResizedImages] = useState<{ original: File; new: string }[]>([]);

  const processData = async () => {
    const processedData: any[] = await Promise.all(
      imgFiles.map(async item => {
        const result: string = await resizeFile(item);
        return {
          original: item,
          new: result
        };
      })
    );
    setResizedImages(processedData);
  };
  useEffect(() => {
    processData();
  }, [imgFiles]);

  const getIndex = (index: number) => index;
  return resizedImages && resizedImages.length > 0 ? (
    <div className="mt-4 flex flex-wrap gap-4">
      {resizedImages.map((img, index) => {
        return (
          <div
            key={getIndex(index)}
            className="relative aspect-square w-[85px] shrink-0 grow-0 overflow-hidden rounded-md shadow-md"
          >
            <img
              onClick={() => window.open(URL.createObjectURL(img.original), "_blank")}
              className="h-full w-full cursor-pointer object-cover object-center transition-all hover:opacity-70"
              src={img.new}
              alt=""
            />
            {handleDelete && (
              <div className="absolute right-1 top-1 h-4 w-4 cursor-pointer rounded-full bg-[#ffffff99]">
                <RiCloseCircleFill
                  onClick={() => handleDelete(img.original.name)}
                  size={20}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#666] transition-all hover:opacity-70"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default ImageSection;
