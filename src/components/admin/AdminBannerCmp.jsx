import React, { useEffect, useState, useRef } from "react";
import { Card, CardFooter, Image, Button, Spinner } from "@nextui-org/react";
import createAxiosInstance from "../../utlis/axiosinstance";
import toast from "react-hot-toast";

function AdminBannerCmp() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null); // Corrected useRef usage
  const axiosInstance = createAxiosInstance("admin");

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/cadmin/admin/banner/");
      if (response.status === 200) {
        setData(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(
        "Some Problem with Fetching current Banner, Refresh page and try again"
      );
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleButtonClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;

        // Check if the aspect ratio is within the acceptable range
        if (aspectRatio >= 1.77 && aspectRatio <= 1.8) {
          // Example: 16:9 ratio
          sendImageToBackend(file);
        } else {
          toast.error(
            "The selected image does not meet the required aspect ratio. Please select another image."
          );
        }

        URL.revokeObjectURL(objectUrl); // Clean up the object URL
      };
    }
  };

   const sendImageToBackend = async (file) => {
     try {
       const formData = new FormData();
       formData.append("image", file);

       setLoading(true);
       const response = await axiosInstance.post(
         "/cadmin/admin/banner/",
         formData
       );

       if (response.status === 200) {
         toast.success("Banner updated successfully!");
         fetchBanner(); // Refresh the banner after update
       } else {
         toast.error("Failed to update the banner. Please try again.");
       }

       setLoading(false);
     } catch (error) {
       setLoading(false);
       console.log(error);
       toast.error("An error occurred while updating the banner.");
     }
   };

  return (
    <div className="flex justify-center items-center">
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="Banner"
            className="object-cover sm:w-[40rem] md:w-[60rem] lg:w-[80rem]"
            src={`https://app.requestly.io/delay/5000/${data.image}`}
            fallbackSrc="https://via.placeholder.com/300x200"
          />
          <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button
              className="text-tiny text-white"
              color="primary"
              radius="lg"
              size="sm"
              onClick={handleButtonClick}
            >
              Change Banner
            </Button>
            <input
              type="file"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default AdminBannerCmp;
