import { toPng } from "html-to-image";

import { useEffect, useRef } from "react";

import { generateColorProggress } from "utils/color";
import storage from "firebaseConfig";
import {
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { useState } from "react";
import useGlobalSlice from "hooks/useGlobalSlice";

const ShareProgress = ({
  progress,
  nombreUsuario,
  courseName,
  averageApprove,
}) => {
  const componentRef = useRef();
  const [urlShare, setUrlShare] = useState(null);
  const [loading, setLoading] = useState(false);
  const { handleSetLoading } = useGlobalSlice();

  useEffect(() => {
    handleSetLoading(loading)
  }, [loading])

  const generateImage = async () => {
    componentRef.current.style.display = "block";

    setTimeout(() => {
      componentRef.current.style.display = "none";
    }, 1);

    const dataUrl = await toPng(componentRef.current);
    const imageFile = b64toBlob(dataUrl, "image/jpeg");
    return imageFile;
  };

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data.split(",")[1]);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new File(byteArrays, `${Date.now()}.jpeg`, { type: contentType });
  }

  async function uploadFile(file) {
    const storageRef = ref(storage, `/shareProgress/${file.name}`); // modificar esta línea para usar un nombre distinto para el archivo
    const uploadTask = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  async function onShare() {
    setLoading(true);
    const file = await generateImage();
    const url = await uploadFile(file);
    setUrlShare(url);
    setLoading(false);
  }

  return (
    <div>
      <div ref={componentRef} style={{ display: "none" }}>
        <div class="containerProgressImage ">
          <div class="logo">
            Learn<span class="logo__sub">Do</span>
          </div>
          <div class="marquee">
            <p>
              {nombreUsuario} tiene un progreso actual de :
              <span style={{ color: generateColorProggress(70, progress) }}>
                {" "}
                {progress}%
              </span>
            </p>
          </div>

          <div class="person">{courseName}</div>
        </div>
      </div>

      <div>
        {!urlShare && !loading && (
          <button
            onClick={() => onShare()}
            className="min-w-[200px] mt-5 flex items-center text-center text-white appearsAnimation transition-all cursor-pointer px-4 py-2 bg-indigo-500 rounded-[20px] shadow-md"
          >
            {" "}
            Compartir progreso en redes sociales
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 ml-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
          </button>
        )}

        {}

        {urlShare && !loading && (
          <div className="flex mt-5">
            <FacebookShareButton url={urlShare} title="Share Facebook">
              <FacebookIcon className="mx-2 rounded-full" />
            </FacebookShareButton>
            <WhatsappShareButton url={urlShare} title="Share Whatsapp">
              <WhatsappIcon className="mx-2 rounded-full" />
            </WhatsappShareButton>
            <TwitterShareButton url={urlShare} title="Share Whatsapp">
              <TwitterIcon className="mx-2 rounded-full" />
            </TwitterShareButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareProgress;
