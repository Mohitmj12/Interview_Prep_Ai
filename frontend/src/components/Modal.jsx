import { div } from 'framer-motion/client'
import React from 'react'

function Modal({children, isOpen, onClose,title, hideHeader}) {
  if (!isOpen) return null;
  return (
    <div className='fixed top-0 left-0 z-50 h-screen w-screen bg-black/40 flex justify-center items-center'>
       <div className='bg-white relative p-5 rounded-lg'>
         {!hideHeader && (
            <div>
                <h2 className=''>{title}</h2>
            </div>
        )}
        <button className='text-gray-400 hover:bg-orange-50 hover:text-black text-3xl absolute right-2 top-2 flex justify-center items-center rounded-lg' onClick={onClose}><ion-icon name="close-outline"></ion-icon></button>
        <div className='overflow-y-auto custom-scrollbar'>
            {children}
        </div>
       </div>
    </div>
  )
}

export default Modal