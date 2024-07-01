import React, { useEffect, useState } from "react";
import createAxiosInstance from "../../../utlis/axiosinstance";
import toast from "react-hot-toast";
import {
  Spinner,
  Modal,
  Image,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../../firebase.config";

function UserprofileForm({ userProfile, setProfile }) {
  const axiosInstance = createAxiosInstance("user");
  const [details, setDetails] = useState({
    user: {
      first_name: "",
      last_name: "",
      phone: "",
    },
    user_image: null,
    birth_date: "",
    gender: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  });
  const [file, setFile] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOtpOpen,
    onOpen: onOtpOpen,
    onOpenChange: onOtpOpenChange,
  } = useDisclosure();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setDetails(userProfile);
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/user-profile");
      setProfile(res.data);
    } catch (error) {
      toast.error("Failed to Fetch Details, Please Login again and try again");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "user_image" && files[0]) {
      setFile(files[0]);
      setDetails((prevDetails) => ({
        ...prevDetails,
        user_image: files[0],
      }));
    } else if (name in details.user) {
      setDetails((prevDetails) => ({
        ...prevDetails,
        user: {
          ...prevDetails.user,
          [name]: value,
        },
      }));
    } else {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[first_name]", details.user.first_name);
    formData.append("user[last_name]", details.user.last_name);
    formData.append("user[phone]", details.user.phone);
    formData.append("birth_date", details.birth_date);
    formData.append("gender", details.gender);
    formData.append("address", details.address);
    formData.append("pincode", details.pincode);
    formData.append("city", details.city);
    formData.append("district", details.district);
    formData.append("state", details.state);
    if (file) {
      formData.append("user_image", file);
    }

    try {
      await axiosInstance.put("/auth/user-profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Failed to Update. Try again or Login again");
    }
  };

  const onCaptchaVerify = () => {
    if (!window.RecaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            verifyOtp();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  };

  const verifyOtp = async (phone) => {
    setLoading(true);
    onCaptchaVerify();
    const phoneNumber = "+91" + phone;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="mt-7 mb-8 lg:w-[50rem] md:w-[30rem] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Profile
            </h1>
          </div>

          <div
            className={
              userProfile ? "mt-5" : "flex justify-center items-center"
            }
          >
            {userProfile ? (
              <form>
                <div className="grid gap-y-4">
                  <div>
                    <Image
                      src={
                        userProfile.user_image ||
                        "https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"
                      }
                      width={200}
                      alt="NextUI Fruit Image with Zoom"
                      className="mb-8 ml-12 lg:ml-[17rem] md:ml-[6rem]"
                    />
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="email"
                        name="first_name"
                        disabled
                        value={userProfile.user.first_name || ""}
                        className="py-3 font-bold px-4 block w-full bg-[#2A3240] border-white rounded-lg text-sm "
                        required
                        aria-describedby="email-error"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Last Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="password"
                        disabled
                        value={userProfile.user.last_name || ""}
                        className="py-3 px-4 font-bold block w-full bg-[#2A3240] rounded-lg text-sm "
                        required
                        aria-describedby="password-error"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="password"
                        disabled
                        value={userProfile.user.email || ""}
                        className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm "
                        required
                        aria-describedby="password-error"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <Input
                        autoFocus
                        value={details.user.phone || ""}
                        disabled
                        label="Phone"
                        labelPlacement="outside"
                        name="phone"
                        endContent={
                          <div>
                            <Button
                              size="sm"
                              color="danger"
                              onPress={onOtpOpen}
                            >
                              Verify
                            </Button>
                          </div>
                        }
                      />
                    </div>
                    <div id="recaptcha"></div>
                  </div>

                  {Object.values(details).some((value) => !value) && (
                    <div className="flex justify-center">
                      <h4 className="font-bold text-red-500">
                        **Complete your profile**
                      </h4>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Birth-Date
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="password"
                        disabled
                        value={userProfile.birth_date || ""}
                        className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm "
                        required
                        aria-describedby="password-error"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Gender
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.gender || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Address
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.address || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Pincode
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.pincode || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        City
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.city || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        District
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.district || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        State
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={userProfile.state || ""}
                        className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "
                      />
                    </div>
                  </div>
                </div>

                <Button color="primary" className="mt-8" onPress={onOpen}>
                  Update Profile
                </Button>
              </form>
            ) : (
              <div className="p-2">
                <Spinner size="lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit your Details
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Input
                    autoFocus
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Enter your first name"
                    name="first_name"
                    value={details.user.first_name || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Enter your last name"
                    name="last_name"
                    value={details.user.last_name || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="Phone"
                    labelPlacement="outside"
                    placeholder="Enter your phone number"
                    name="phone"
                    value={details.user.phone || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    type="date"
                    label="Birth-Date"
                    labelPlacement="outside"
                    name="birth_date"
                    value={details.birth_date || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="Gender"
                    labelPlacement="outside"
                    placeholder="Enter your gender"
                    name="gender"
                    value={details.gender || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="Address"
                    labelPlacement="outside"
                    placeholder="Enter your address"
                    name="address"
                    value={details.address || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="Pincode"
                    labelPlacement="outside"
                    placeholder="Enter your pincode"
                    name="pincode"
                    value={details.pincode || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="City"
                    labelPlacement="outside"
                    placeholder="Enter your city"
                    name="city"
                    value={details.city || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="District"
                    labelPlacement="outside"
                    placeholder="Enter your district"
                    name="district"
                    value={details.district || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    label="State"
                    labelPlacement="outside"
                    placeholder="Enter your state"
                    name="state"
                    value={details.state || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    autoFocus
                    type="file"
                    label="Image"
                    labelPlacement="outside"
                    placeholder="Upload an image"
                    name="user_image"
                    onChange={handleInputChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button type="button" color="danger" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOtpOpen} onOpenChange={onOtpOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Verify your Phone Number
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  type="tel"
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="Enter phone number"
                  value={details.user.phone || ""}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      user: {
                        ...prevDetails.user,
                        phone: e.target.value,
                      },
                    }))
                  }
                />

                <Input
                  autoFocus
                  type="tel"
                  label="Enter OTP"
                  labelPlacement="outside"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="button"
                  className="mt-6"
                  onPress={async () => {
                    setLoading(true);
                    const phone = details.user.phone;
                    await verifyOtp(phone);
                    setLoading(false);
                  }}
                  isLoading={loading}
                >
                  Verify
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserprofileForm;
