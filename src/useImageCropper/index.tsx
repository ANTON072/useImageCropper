import { useMemo, useState } from "react";

import Cropper, { Area, CropperProps } from "react-easy-crop";
import ImageBlobReduce from "image-blob-reduce";
import { getCroppedBlob } from "./utils";

interface UseImageCropper {
  aspect?: number;
}

const useImageCropper = ({ aspect = 4 / 3 }: UseImageCropper = {}) => {
  const [inputObjectURL, setInputObjectURL] = useState<string | null>(null);
  // cropした後の画像のファイルサイズ（バリデーションに利用する）
  const [outputFileSize, setOutputFileSize] = useState<number>(0);
  // cropした後の画像のピクセル情報
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const [crop, setCrop] = useState<CropperProps["crop"]>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropReset = () => {
    if (inputObjectURL) URL.revokeObjectURL(inputObjectURL);
    setInputObjectURL(null);
    setOutputFileSize(0);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  /**
   *
   * @param croppedArea 画像エディタ上でのクロップ領域。値は0〜100のパーセンテージで表される。 元の画像のサイズに対する相対的な位置とサイズを示す。UI上でのクロップボックスの位置とサイズを制御するのに利用する。
   * @param croppedAreaPixels 実際に切り抜かれる画像領域。値はピクセル谷。元画像の絶対的な位置とサイズを示す。実際の画像処理に利用する。
   */
  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onGenerateCroppedImage = async () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!inputObjectURL || !croppedAreaPixels) {
        reject(new Error("Failed to generate cropped image"));
        return;
      }
      const croppedBlob = await getCroppedBlob(
        inputObjectURL,
        croppedAreaPixels
      );
      resolve(croppedBlob);
      // console.log("croppedBlob", croppedBlob);
    });
  };

  const cropperComponent = useMemo(() => {
    if (!inputObjectURL) return null;

    return (
      <Cropper
        image={inputObjectURL}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropComplete={onCropComplete}
        onCropChange={setCrop}
        onZoomChange={setZoom}
      />
    );
  }, [aspect, crop, inputObjectURL, zoom]);

  return {
    setInputObjectURL,
    cropperComponent,
    zoom,
    setZoom,
    onCropReset,
    onGenerateCroppedImage,
    outputFileSize,
  };
};

export default useImageCropper;
