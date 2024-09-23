import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "../../../utlis/axiosinstance";
import { toast } from "react-hot-toast";
import AdminAuthContext from "../../../Context/AdminAuthContext";
import { Button } from "@nextui-org/react";

function AdminLogin() {
  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance("admin");
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AdminAuthContext);
  const [loginData, setLogin] = useState({
    email: "",
    password: "",
  });
  const[loading,setLoading] = useState(false)

  const handleChange = (e) => {
    setLogin({ ...loginData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("all fields are required");
    } else {
      try {
        setLoading(true)
        const res = await axiosInstance.post("/cadmin/admin/token", loginData);
        const response = res.data;
        setLoading(false)

        const admin = {
          email: response.email,
          name: response.name,
        };

        if (res.status == 200) {
          localStorage.setItem("admin", JSON.stringify(admin));
          localStorage.setItem(
            "admin_access",
            JSON.stringify(response.access_token)
          );
          localStorage.setItem(
            "admin_refresh",
            JSON.stringify(response.refresh_token)
          );
          setLoading(false);
          navigate("/admin/user-list");
          toast.success("Login successful");
          setIsAdminLoggedIn(true);
        }
      } catch (error) {
        if (error.response) {
          setLoading(false);
          if (error.response.status === 400) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        } else if (error.request) {
          setLoading(false);
          toast.error(
            "No response received from the server. Please try again later."
          );
        } else {
          setLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1b1c31]">
      <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 class="font-bold text-center text-2xl mb-5 dark:text-white">
          FLICKZ ADMIN{" "}
        </h1>
        <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div class="px-5 py-7">
            <form onSubmit={handleSubmit}>
              <label class="font-semibold text-sm text-gray-600 pb-1 block">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                class="text-black bg-slate-300 border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label class="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                class=" text-black bg-slate-300 border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <div className="flex justify-center items-center">
                <Button isLoading={loading} type="submit" color="primary">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
