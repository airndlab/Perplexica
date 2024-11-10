import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AWS from 'aws-sdk';
import { CopyPlus } from 'lucide-react';

const SettingsDialog = ({ className }: { className: any }) => {
  // Create state to store file
  // const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to upload file to s3
  const uploadFile = async (file: any) => {
    setTimeout(() => {
      setLoading(false)
    }, 10000);

    // S3 Bucket Name
    const S3_BUCKET = `${process.env.S3_BUCKET}`;

    // S3 Region
    const REGION = "";

    // S3 Credentials
    AWS.config.update({
      accessKeyId: `${process.env.S3_ACCESS_KEY}`,
      secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`,
    });
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    // Files Parameters

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt: any) => {
        // File uploading progress
        console.log(
          // @ts-ignore
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    // @ts-ignore
    await upload.then((err, data) => {
      console.log(err);
      // Fille successfully uploaded
      console.log("File uploaded successfully.");
    });
  };

  // Function to handle file and store it to file state
  const handleFileChange = async (e: any) => {
    setLoading(true);
    // Uploaded file
    const file = e.target.files[0];
    console.log(file);
    // Changing file state
    // setFile(file);

    await uploadFile(file);
  };

  const fileInputRef = React.useRef(null);

  return (
    <>
      <CopyPlus
        // @ts-ignore
        onClick={() => fileInputRef.current.click()}
        className={className}
      />
      <input ref={fileInputRef} type="file" onChange={handleFileChange} hidden />
      {loading && <Loading />}
    </>
  );
};

const Loading = () => {
  const loadingTexts = [
    "Загрузка...",
    "Индексация...",
    "Саммаризация...",
    "Категоризация...",
    "Генерация превью..."
  ];

  const [currentText, setCurrentText] = useState(loadingTexts[0]);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2000);

    // Очищаем интервал через 30 секунд
    const timeoutId = setTimeout(() => clearInterval(intervalId), 10000);

    // Очищаем таймеры при размонтировании компонента
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setCurrentText(loadingTexts[textIndex]);
  }, [textIndex]);

  return ReactDOM.createPortal(
    <div className="flex flex-col items-center justify-center min-h-screen fixed inset-0 z-50">
      <div className="fixed inset-0 bg-white/50 dark:bg-black/50"></div>
      <div>
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
      <h1 className="z-10 text-3xl font-medium p-2">{currentText}</h1>
    </div>,
    document.body,
  )
}

export default SettingsDialog;
