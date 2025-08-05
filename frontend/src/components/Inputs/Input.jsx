import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
function Input({ value, onChange, label, placeholder, type }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className="text-slate-800">{label}</label>
      <div className="input-box">
        <input
          value={value}
          className="bg-transparent outline-none w-full"
          onChange={onChange}
          placeholder={placeholder}
          type={showPassword ? "text" : type}
        />
        {type === "password" && (
          <button onClick={togglePasswordVisibility}>
            {showPassword ? (
              <FaRegEye size={22} className="text-primary cursor-pointer"/>
            ) : (
              <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer"/>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;
