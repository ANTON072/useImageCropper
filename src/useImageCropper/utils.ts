import { Area } from "react-easy-crop";

export const createImageElement = (objectURL: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const imageElement = new Image();
    imageElement.src = objectURL;
    imageElement.onload = () => {
      resolve(imageElement);
    };
    imageElement.onerror = (error) => {
      reject(error);
    };
    imageElement.setAttribute("crossOrigin", "anonymous");
  });
};

export const getCroppedBlob = async (
  objectURL: string,
  croppedAreaPixels: Area
) => {
  const imageElement = await createImageElement(objectURL);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get 2d context from canvas");
  }
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  context.drawImage(
    imageElement,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create a blob");
      }
      resolve(blob);
    });
  });
};
