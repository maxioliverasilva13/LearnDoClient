import { toPng } from 'html-to-image';

import { useRef } from 'react';

import { generateColorProggress } from 'utils/color';
import storage from "firebaseConfig";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { useState } from 'react';


const ShareProgress = ({ progress, nombreUsuario, courseName, averageApprove }) => {
  const componentRef = useRef();
  const [urlShare, setUrlShare] = useState(null);
  const [loading, setLoading] = useState(false);


  const generateImage = async () => {
    componentRef.current.style.display = 'block';

    setTimeout(() => {
      componentRef.current.style.display = 'none';
    }, 1);

    const dataUrl = await toPng(componentRef.current)
    const imageFile = b64toBlob(dataUrl, "image/jpeg");
    return imageFile;

  };

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data.split(',')[1]);
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
    const storageRef = ref(
      storage,
      `/shareProgress/${file.name}`
    ); // modificar esta línea para usar un nombre distinto para el archivo
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
    <div >
      <div ref={componentRef} style={{ display: "none" }}>
        <div class="containerProgressImage ">
          <div class="logo">
            Learn<span class="logo__sub">Do</span>
          </div>
          <div class="marquee">
            <p>
              {nombreUsuario} tiene un progreso actual de :<span style={{ color: generateColorProggress(70, progress) }}> {progress}%</span>

            </p>

          </div>

          <div class="person">
            {courseName}
          </div>
        </div>
      </div>

      <div>

        {
          (!urlShare && !loading) && (<button onClick={() => onShare()} className="min-w-[200px] mt-5 flex items-center text-center text-white appearsAnimation transition-all cursor-pointer px-4 py-2 bg-indigo-500 rounded-[20px] shadow-md"> Compartir progreso en redes sociales
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>)

        }

{
          (!urlShare && loading) && (
            <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
          )
        }

        {
          (urlShare && !loading) && (
            <div className='flex mt-5'>
              <FacebookShareButton url={urlShare}  title="Share Facebook">
                <FacebookIcon   className="mx-2 file:rounded-full" />
              </FacebookShareButton>
              <WhatsappShareButton url={urlShare}  title="Share Whatsapp">
                <WhatsappIcon   className="mx-2 file:rounded-full" />
              </WhatsappShareButton>
              <TwitterShareButton   url={urlShare}  title="Share Whatsapp">
                <TwitterIcon className="mx-2 file:rounded-full" />
              </TwitterShareButton>
            </div>
          )
        }








      </div>




    </div>

  );
}


export default ShareProgress;
