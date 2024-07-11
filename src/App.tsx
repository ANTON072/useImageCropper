import { useRef, useState } from "react";
import useImageCropper from "./useImageCropper";

function App() {
  const {
    setInputObjectURL,
    cropperComponent,
    onCropReset,
    onGenerateCroppedImage,
  } = useImageCropper({
    resizeOptions: {
      max: 500,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [output, setOutput] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const objectURL = URL.createObjectURL(file);
    setInputObjectURL(objectURL);
  };

  const handleClear = () => {
    onCropReset();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    const blob = (await onGenerateCroppedImage()) as Blob;
    setOutput(URL.createObjectURL(blob));
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          disabled={isLoading}
        />
        <div>
          <button onClick={handleClear} disabled={isLoading}>
            Clear
          </button>
          <button onClick={handleComplete} disabled={isLoading}>
            Complete
          </button>
        </div>
        <div
          style={{
            position: "relative",
            width: "500px",
            height: "300px",
          }}
        >
          {cropperComponent}
        </div>
        <div>{output && <img src={output} alt="output" />}</div>
      </div>
    </>
  );
}

export default App;
