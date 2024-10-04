
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import createAxiosInstance from "../../utlis/axiosinstance";
import { Button } from "@nextui-org/react";



function TheatreChangepasswordForm() {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const axiosInstance = createAxiosInstance("user");
  const [newpasswords, setNewPassword] = useState({
    password: "",
    confirm_password: "",
  });
  const { password, confirm_password } = newpasswords;

  const handleChange = (e) => {
    setNewPassword({ ...newpasswords, [e.target.name]: e.target.value });
  };

  const data = {
    password: password,
    confirm_password: confirm_password,
    uidb64: uid,
    token: token,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data) {
      if(data.password !== data.confirm_password){
        toast('Password doe not match ')
        return
      }
      const res = await axiosInstance.patch("theatre/set-new-password/", data);
      const response = res.data;
      if (res.status === 200) {
        navigate("/theatre/login");
        toast.success(response.message);
      }
      console.log(response);
    }
  };

  

  return (
    <>
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-6 flex flex-col items-center">
        <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4">
          Set New Password
        </h1>
        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="password"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              New Password
            </label>
            <input
              value={password}
              onChange={handleChange}
              type="text"
              id="password"
              name="password"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="password2"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              Confirm Password
            </label>
            <input
              value={confirm_password}
              onChange={handleChange}
              type="text"
              id="password2"
              name="confirm_password"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            size="lg"
           color="secondary"
          >
            Confirm
          </Button>
        </form>
      </div>
      </div>
    </>
  );
}

export default TheatreChangepasswordForm;
