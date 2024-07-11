import { useMemo, useState } from "react";

import Cropper, { Area, CropperProps } from "react-easy-crop";
import { ResizeOptions } from "image-blob-reduce";

import { getCroppedBlob, reduceImageBlob } from "./utils";

interface UseImageCropper {
  cropOptions?: Partial<
    Pick<
      CropperProps,
      | "aspect"
      | "cropShape"
      | "minZoom"
      | "maxZoom"
      | "zoomWithScroll"
      | "zoomSpeed"
      | "showGrid"
      | "objectFit"
      | "style"
      | "classes"
    >
  >;
  resizeOptions?: ResizeOptions;
}

const useImageCropper = ({
  cropOptions = {
    aspect: 4 / 3,
  },
  resizeOptions = {},
}: UseImageCropper = {}) => {
  const [inputObjectURL, setInputObjectURL] = useState<string | null>(null);
  // cropした後の画像のピクセル情報
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const [crop, setCrop] = useState<CropperProps["crop"]>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropReset = () => {
    if (inputObjectURL) URL.revokeObjectURL(inputObjectURL);
    setInputObjectURL(null);
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
    if (!inputObjectURL || !croppedAreaPixels) {
      return;
    }
    const croppedBlob = await getCroppedBlob(inputObjectURL, croppedAreaPixels);
    if (!croppedBlob) {
      return;
    }
    return reduceImageBlob(croppedBlob, resizeOptions);
  };

  const cropperComponent = useMemo(() => {
    if (!inputObjectURL) return null;

    return (
      <Cropper
        {...cropOptions}
        image={inputObjectURL}
        crop={crop}
        zoom={zoom}
        onCropComplete={onCropComplete}
        onCropChange={setCrop}
        onZoomChange={setZoom}
      />
    );
  }, [crop, cropOptions, inputObjectURL, zoom]);

  return {
    setInputObjectURL,
    cropperComponent,
    zoom,
    setZoom,
    onCropReset,
    onGenerateCroppedImage,
  };
};

export default useImageCropper;
