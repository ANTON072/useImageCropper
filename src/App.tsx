import { useRef, useState } from "react";
import useImageCropper from "./useImageCropper";

function App() {
  const {
    setInputObjectURL,
    cropperComponent,
    onCropReset,
    onGenerateCroppedImage,
  } = useImageCropper();
  const inputRef = useRef<HTMLInputElement>(null);

  const [output, setOutput] = useState<string | null>(null);

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
    const blob = (await onGenerateCroppedImage()) as Blob;
    console.log("blob", blob);
    setOutput(URL.createObjectURL(blob));
  };

  return (
    <>
      <div>
        <input type="file" ref={inputRef} onChange={handleChange} />
        <div>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleComplete}>Complete</button>
        </div>
        <div
          style={{
            position: "relative",
            width: "900px",
            height: "600px",
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
