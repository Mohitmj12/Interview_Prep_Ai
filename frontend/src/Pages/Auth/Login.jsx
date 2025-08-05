import {useContext, useState} from 'react'
import Input from '../../components/Inputs/Input'
import {useNavigate} from 'react-router-dom'
import validateEmail from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../Context/userContext'
function Login({setCurrentPage}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const {updateUser} = useContext(UserContext)


  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if(!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if(!password) {
      setError("Password is required.")
      return
    }
    setError(null)
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,password
       })
       const {token} = response.data;

       if(token){
        localStorage.setItem("token", token)
        updateUser(response.data)
        navigate("/dashboard")
       }
    }catch(err) {
      if(err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      }else{
        setError("Something went wrong. Please try again later.")
      }
  }
}
  return (
    <div className='w-[90vw] md:w-[33vw]'>
      <h1 className='text-lg font-semibold'>Welcome back</h1>
      <p className='text-xs text-slate-700 mt-2 mb-5'>Please enter your credentials to continue</p>
      <form onSubmit={handleLogin}>
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
      <button  type="submit" className='btn-primary'>LOGIN</button>
      <p className='text-[13px] text-slate-800 mt-3'>
        Don't have an account?{' '}
        <button className='font-medium text-primary underline cursor-pointer' onClick={() => {
            setCurrentPage("signup")
          }}>
          SignUp
        </button>
      </p>
      </form>
    </div>
  )
}

export default Login