import axios from "axios";
import guiConfig from "~/gui-config";

const { imagesUrl, apiUrl } = guiConfig;

export const http = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json"
  }
});

export const uploadFile = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/goods/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const getFiles = () => {
  return http.get("/goods/images/files");
};