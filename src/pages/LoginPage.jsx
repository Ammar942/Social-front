import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../contexts/auth/useAuth";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/feed");
    } catch (err) {
      console.log(err);
      setServerError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered"
                {...register("password", { required: "Password is required" })}
              />
              <div
                className="absolute right-12 top-42 z-1 cursor-pointer text-lg text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <div className="form-control mt-4 text-center">
              <button className="btn btn-primary " type="submit">
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link className="link link-primary" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
