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
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../../../firebase.config";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

function UserprofileForm({ userProfile, setProfile }) {
  const axiosInstance = createAxiosInstance("user");
  const [details, setDetails] = useState({
    user: {
      first_name: "",
      last_name: "",
      phone: "",
    },
    user_image: "",
    birth_date: "",
    gender: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  });
 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOtpOpen,
    onOpen: onOtpOpen,
    onOpenChange: onOtpOpenChange,
  } = useDisclosure();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

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
    const { name, value } = e.target;
    if (name in details.user) {
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

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userData = {
      first_name: details.user.first_name,
      last_name: details.user.last_name,
      phone: details.user.phone,
    };
    formData.append("user", JSON.stringify(userData));
    formData.append("birth_date", details.birth_date);
    formData.append("gender", details.gender);
    formData.append("address", details.address);
    formData.append("pincode", details.pincode);
    formData.append("city", details.city);
    formData.append("district", details.district);
    formData.append("state", details.state);
    if (details.user_image) {
      formData.append("user_image", details.user_image);
    }

    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${details.pincode}`
      );
      const response = res.data;

      console.log("res", res.data[0].Status);
      console.log("response", response);

      if (response[0].Status === "Error") {
        toast.error("Provide a Proper Pincode");
        return;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      await axiosInstance.put("/auth/user-profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Updated Successfully");
      fetchUserProfile()
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
        }
      );
    }
  };

  const verifyOtp = async (phone) => {
    setLoading(true);
    onCaptchaVerify();
    const phoneNumber = "+91" + phone;
    const phoneProvider = new PhoneAuthProvider(auth);
    try {
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        window.recaptchaVerifier
      );
      toast.success("Verification code sent to your phone");
      setVerificationId(verificationId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast("Please wait senting OTP.");
    }
  };

  const verifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      try {
        const res = await axiosInstance.patch("/auth/verify-mobile/");
        if (res.status === 200) {
          toast.success("Phone authentication successful!");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
      alert("Error during phone authentication");
    }
  };

  const handleProfileChange = (files) => {
    const successFile = files.allEntries.find((f) => f.status === "success");
    if (successFile) {
      const cdnUrl = successFile.cdnUrl;
      setDetails((prevState) => ({
        ...prevState,
        user_image: cdnUrl,
      }));
    }
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
                        //  endContent={
                        //    <div>
                        //      {details.is_mobile_verified ? (
                        //        <i
                        //          className="fa-solid fa-circle-check"
                        //          style={{ color: "#29eb0f" }}
                        //        ></i>
                        //      ) : (
                        //        <Button
                        //         size="sm"
                        //        color="danger"
                        //      onPress={onOtpOpen}
                        //        onClick={() => verifyOtp(details.user.phone)}
                        //      >
                        //         Verify
                        //      </Button>
                        //      )}
                        //   </div>
                        // }
                      />
                    </div>
                    <div id="recaptcha"></div>
                  </div>

                  {(!details.user.first_name ||
                    !details.user.last_name ||
                    !details.user.phone ||
                    !details.birth_date ||
                    !details.gender ||
                    !details.address ||
                    !details.pincode ||
                    !details.city ||
                    !details.district ||
                    !details.state) && (
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
                  <p>profile picture</p>
                  <FileUploaderRegular
                    onChange={handleProfileChange}
                    pubkey="84b299193c8297b74db7"
                    maxLocalFileSizeBytes={5000000}
                    multiple={false}
                    imgOnly={true}
                    sourceList="local,url"
                    classNameUploader="my-config uc-dark"
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
                  label="Enter OTP"
                  labelPlacement="outside"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="button"
                  className="mt-6"
                  onClick={verifyCode}
                >
                  Verify
                </Button>
                <div id="recaptcha-container"></div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserprofileForm;
