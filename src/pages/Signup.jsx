import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password", "");

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const sendData = {
      username: data.username,
      password: data.password,
      email: data.email,
    };
    console.log("🚀 ~ onSubmit ~ sendData:", sendData);
    setServerError("");
    setLoading(true);
    try {
      await axios.post("/auth/register", sendData);
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-700 text-white p-4">
      <div className="w-full max-w-md   bg-opacity-70 backdrop-filter bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          {/* Socialio Icon - Using a placeholder for now, replace with actual SVG/component */}
          <div className="mx-auto bg-black/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold mb-2">Join Socialo</h2>
          <p className="text-sm text-gray-300">
            Create your account and start connecting
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full py-3 px-4 pl-10 rounded-lg bg-white bg-opacity-10 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400 text-black"
                placeholder="Enter your full name"
                {...register("username", { required: "Full Name is required" })}
              />
              <FaUser className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full py-3 px-4 pl-10 rounded-lg bg-white bg-opacity-10 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400 text-black"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              <MdEmail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-3 px-4 pl-10 rounded-lg bg-white bg-opacity-10 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400 text-black"
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <RiLockPasswordFill className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full py-3 px-4 pl-10 rounded-lg bg-white bg-opacity-10 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400 text-black"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <RiLockPasswordFill className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms and Privacy Policy Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              className="form-checkbox h-4 w-4 text-purple-600 bg-white bg-opacity-20 border-gray-500 rounded focus:ring-purple-500"
              {...register("agreeTerms", {
                required: "You must agree to the terms and privacy policy",
              })}
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
              I agree to the{" "}
              <Link to="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-400 text-xs">{errors.agreeTerms.message}</p>
          )}

          {serverError && (
            <p className="text-red-400 text-sm text-center">{serverError}</p>
          )}

          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r cursor-pointer from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 font-semibold text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
