import { div } from 'framer-motion/client';
import {useState,useRef} from 'react'
import {LuUser,LuUpload,LuTrash} from "react-icons/lu"

function ProfilePhotoSelector({ image, setImage,preview,setPreview }) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file){
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreview(preview);
            if(setPreview){
                setPreview(preview);
            }
            setPreviewUrl(preview);
        }
    }
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (setPreview) {
            setPreview(null);
        }
    }
    const onChooseFile = () => {
        inputRef.current.click();
    }

  return (
    <div className='w-full flex justify-center items-center'>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleImageChange}
      />
      {!image ? (
        <div className=' bg-orange-50 w-20 h-20 rounded-full flex justify-center items-center relative'>
            <LuUser className='text-4xl text-orange-500' />
            <button onClick={onChooseFile} className='bg-linear-to-r from-orange-500/85 to-orange-600 text-white rounded-full h-8 w-8 flex justify-center items-center absolute -bottom-1 -right-1 cursor-pointer'>
                <LuUpload/>
            </button>
        </div>
      ) : (
        <div className='relative'>
            <img className='w-20 h-20 rounded-full object-cover' src={preview || previewUrl} alt="Profile Preview" />
            <button onClick={handleRemoveImage} className='w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'>
                <LuTrash />
            </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector