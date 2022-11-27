import axiosClient from "./axios";
import { v4 as uuidv4 } from "uuid";
import { SASToken } from "@/types/SASToken";
import { BlockBlobClient } from "@azure/storage-blob";

const getImageUrl = async (imageName: string): Promise<string | undefined> => {
  const res = await axiosClient().get("/sas_token");
  if (res.status != 200) {
    console.error("cannot get sas token");
    return undefined;
  }
  const sasToken: SASToken = res.data;
  return `${sasToken.url}/image/${imageName}?${sasToken.sasKey}`;
};

export const getImageBlobUrl = async (
  imageName: string
): Promise<string | undefined> => {
  const url = await getImageUrl(imageName);
  if (!url) {
    return undefined;
  }
  const res = await axiosClient().get(url, {
    responseType: "arraybuffer",
  });
  const image = res.data;
  return URL.createObjectURL(new Blob([image], { type: "image/jpg" }));
};

export const uploadImage = async (
  targetFile: File
): Promise<string | undefined> => {
  const fileName = uuidv4();
  const extension = targetFile.name.split(".").pop();
  if (!extension) {
    console.error("cannot extract extention");
    return undefined;
  }
  const imageUrl = await getImageUrl(`${fileName}.${extension}`);
  if (!imageUrl) {
    return undefined;
  }
  const blockBlobClient = new BlockBlobClient(imageUrl);
  blockBlobClient.uploadData(targetFile);
  return fileName;
};
