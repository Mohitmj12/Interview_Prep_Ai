import {useContext, useState} from 'react'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input'
import validateEmail from '../../utils/helper'
import { UserContext } from '../../Context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
function SignUp({ setCurrentPage }) {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if(!fullName){
      setError("Please enter full name.");
      return;
    }
    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if(!password) {
      setError("Password is required.");
      return;
    }
    setError("");
    try{
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name:fullName,
        email,
        password,
        profileImageUrl
      })

      const {token} = response.data;
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data)
        navigate("/dashboard")
      }
    }catch(err) {
      if(err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      }else{
        setError("Something went wrong. Please try again later.");
      }
  }
}
  return (
    <div className='w-[90vw] md:w-[33vw]'>
      <h1 className='text-lg font-semibold'>Create an Account</h1>
      <p className='text-xs text-slate-700 mt-2 mb-5'>Join us by entering your details below.</p>
      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} preview={profilePreview}
  setPreview={setProfilePreview} />

        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          label='Full Name'
          placeholder='John Doe'
          type='text'
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label='Email Address'
          placeholder='john@example.com'
          type='email'
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        label='Password'
        placeholder='Min 8 characters'
        type='password'
        />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
      <button  type="submit" className='btn-primary'>SIGN UP</button>
      <p className='text-[13px] text-slate-800 mt-3'>
        Don't have an account?{' '}
        <button className='font-medium text-primary underline cursor-pointer' onClick={() => {
            setCurrentPage("login")
          }}>
          Login
        </button>
      </p>
      </form>
    </div>
  )
}

export default SignUp