import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="font-bold text-4xl dark:text-white">
            <span className="px-2 py-1  bg-red-700 rounded-lg text-white">SWSWBS</span>
            <span className="ml-2 text-gray-800 dark:text-gray-200">Survey</span>
          </Link>
        </div>

        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center">
          <p className="mb-4 text-xl font-semibold">Welcome to the South Wales Social Well-being Survey!</p>
          <p className="mb-4">
            Sign in to participate in our insightful survey designed with the
            <span className="font-bold text-indigo-600 dark:text-indigo-400"> South Wales Social Well-being Scale (SWSWBS)</span>.
          </p>
          <p className="mb-4">Your input helps us shape and enhance health policies and practices to address the multifaceted aspects of well-being.</p>
        </div>

        <div className="text-center">
          <form className="inline-block w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" value="Email" />
              <span className="text-red-500">*</span>
              <TextInput type="email" placeholder="name@company.com" id="email" required className="w-full" onChange={handleChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" value="Password" />
              <span className="text-red-500">*</span>
              <TextInput type="password" placeholder="********" id="password" required className="w-full" onChange={handleChange} />
            </div>
            <Button className="w-full mt-4  bg-red-700" type="submit" disabled={loading} outline>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="p-3"> Loading... </span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="mt-4">
            <span>
              Don't have an account?
              <Link to="/sign-up" className="font-bold text-purple-600 dark:text-purple-400 ml-1">
                {" "}
                Sign Up
              </Link>
            </span>
          </div>
          {errorMessage && (
            <Alert className="mt-4" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
