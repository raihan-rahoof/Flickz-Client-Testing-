import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Spinner,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import createAxiosInstance from "../../utlis/axiosinstance";
import toast from "react-hot-toast";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import axios from "axios";

function TheatreProfileComponent() {
  const [formData, setFormData] = useState({
    owner_name: "",
    theatre_name: "",
    phone_number: "",
    license: "",
    google_maps_link: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [theatreData, setTheatreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('theatre'))
  const axiosInstance = createAxiosInstance("theatre");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchTheatreProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/theatre/theatre-profile/");
      setTheatreData(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Some error occurred, please refresh the page and try again");
    }
  };

  useEffect(() => {
    fetchTheatreProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLiecenseChange = (files) => {
    const successFile = files.allEntries.find((f) => f.status === "success");
    if (successFile) {
      const cdnUrl = successFile.cdnUrl;
      setFormData((prevState) => ({
        ...prevState,
        license: cdnUrl,
      }));
      
    }
  };

  const handleProfileUpdate = async () => {
    if (!/^(?:\+91|0)?[789]\d{9}$/.test(formData.phone_number)) {
      toast.error("Invalid mobile number. It should be 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Invalid pincode. It should be 6 digits.");
      return;
    }
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${formData.pincode}`
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
      setLoading(true);
      const response = await axiosInstance.put(
        "/theatre/theatre-profile/",
        formData
      );
      setTheatreData(response.data);
      setLoading(false);
      toast.success("Profile updated successfully");
      fetchTheatreProfile();
      onOpenChange(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error updating profile");
    }
  };
  console.log(formData);

  if (!theatreData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" label="loading..." color="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="bg-card dark:bg-[#2a2b2e] p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-primary-foreground dark:text-primary-foreground">
              Theatre Profile
            </h1>
            <p className="font-bold">{user.theatre_email}</p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  disabled
                  label="Theatre Owner"
                  labelPlacement="inside"
                  id="theatre-owner"
                  value={theatreData.owner_name}
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
              </div>
              <div>
                <Input
                  disabled
                  label="Theatre Name"
                  labelPlacement="inside"
                  id="theatre-name"
                  value={theatreData.theatre_name}
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
              </div>
            </div>
            <div>
              <Input
                disabled
                label="Phone Number"
                type="number"
                labelPlacement="inside"
                id="phone-number"
                value={theatreData.phone_number}
                className="dark:bg-[#2a2b2e] dark:text-card-foreground"
              />
            </div>
            <div>
              <p className="ml-2 text-sm pb-2">License</p>
              <Image
                alt="License Image"
                src={`https://app.requestly.io/delay/5000/${theatreData.license}`}
              />
            </div>
            <div>
              <Textarea
                id="address"
                label="Theatre Address"
                value={theatreData.address}
                rows={2}
                disabled
                className="dark:bg-[#2a2b2e] dark:text-card-foreground"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Input
                  disabled
                  label="City"
                  id="city"
                  value={theatreData.city}
                  labelPlacement="inside"
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
              </div>
              <div>
                <Input
                  disabled
                  id="district"
                  label="District"
                  value={theatreData.district}
                  labelPlacement="inside"
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
              </div>
              <div>
                <Input
                  disabled
                  id="state"
                  label="State"
                  value={theatreData.state}
                  labelPlacement="inside"
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
              </div>
            </div>
            <div>
              <Input
                disabled
                id="pincode"
                label="Pincode"
                value={theatreData.pincode}
                labelPlacement="inside"
                className="dark:bg-[#2a2b2e] dark:text-card-foreground"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <Input
                  disabled
                  id="google-maps"
                  value={theatreData.google_maps_link}
                  placeholder="Enter Google Maps link"
                  className="dark:bg-[#2a2b2e] dark:text-card-foreground"
                />
                <a
                  href={theatreData.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-sm  flex justify-center text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-[8rem] p-2.5 bg-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light hover:border-blue-500"
                >
                  <i className="fa-solid fa-location-dot"></i>
                </a>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button onPress={onOpen} color="secondary">
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for updating profile */}
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Theatre Profile
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Theatre Owner"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                />
                <Input
                  label="Theatre Name"
                  name="theatre_name"
                  value={formData.theatre_name}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone Number"
                  name="phone_number"
                  type="number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
                <Textarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
                <Input
                  label="Google Maps Link"
                  name="google_maps_link"
                  value={formData.google_maps_link}
                  onChange={handleInputChange}
                />
                <p className="text-sm">liecense</p>
                <FileUploaderRegular
                  pubkey="84b299193c8297b74db7"
                  maxLocalFileSizeBytes={5000000}
                  onChange={handleLiecenseChange}
                  multiple={false}
                  imgOnly={true}
                  sourceList="local"
                  classNameUploader="my-config uc-dark"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleProfileUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TheatreProfileComponent;
