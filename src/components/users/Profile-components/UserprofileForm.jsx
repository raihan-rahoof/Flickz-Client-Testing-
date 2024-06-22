import React,{useEffect, useState} from 'react'
import createAxiosInstance from '../../../utlis/axiosinstance';
import toast from 'react-hot-toast'
import {Spinner, Modal, Image, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea } from "@nextui-org/react";
import axios from 'axios';


function UserprofileForm({userProfile,setProfile}) {

  const axiosInstance = createAxiosInstance('user')

  const [details, setDetails] = useState({
    user: {
      first_name: '',
      last_name: '',
      phone: '',
      
    },
    user_image: null,
    birth_date: '',
    gender: '',
    address: '',
    pincode: '',
    city: '',
    district: '',
    state: ''
  });

  const [file,setFile]=useState(null)
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  
  useEffect(() => {

      fetchUserProfile();
    
  }, [])

  

   useEffect(() => {
    if (userProfile) {
      setDetails(userProfile);
    }
  }, [userProfile]);

  const fetchUserProfile = async ()=> {
      try {
        const res = await axiosInstance.get('/auth/user-profile')
        setProfile(res.data)
         
        
      } catch (error) {
        toast.error('Failed to Fetch Details , Please Login again and try again')
      }
  }

  
const handleInputChange = (e) => {
    const { name, value,files } = e.target;

    if (name === 'user_image' && files[0]) {
      setFile(files[0]);
      setDetails(prevDetails => ({
        ...prevDetails,
          user_image: files[0]
      }));
    }else if (name in details.user) {
      setDetails(prevDetails => ({
        ...prevDetails,
        user: {
          ...prevDetails.user,
          [name]: value
        }
      }));
    } else {
      setDetails(prevDetails => ({
        ...prevDetails,
        [name]: value
      }));
    }
  }

  console.log(details);
  

  const handleSubmit = async (e)=>{
    e.preventDefault;
    const formData = new FormData();
    formData.append('user[first_name]', details.user.first_name);
    formData.append('user[last_name]', details.user.last_name);
    formData.append('user[phone]', details.user.phone);
    formData.append('birth_date', details.birth_date);
    formData.append('gender', details.gender);
    formData.append('address', details.address);
    formData.append('pincode', details.pincode);
    formData.append('city', details.city);
    formData.append('district', details.district);
    formData.append('state', details.state);
    if (file) {
      formData.append('user_image', file);
    }

    try{
      
      await axiosInstance.put('/auth/user-profile/',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      toast.success('Profile Updated Successfully')
    }catch(error){
      toast.error('Failed to Update Try agin or Login agian')
    }
  }
  
  


  return (

    <>
    <div className="mt-7 mb-8 lg:w-[50rem] md:w-[30rem] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
  <div className="p-4 sm:p-7">
    <div className="text-center">
      <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>

    </div>

    <div className={userProfile ? 'mt-5' : 'flex justify-center items-center'}>
    {userProfile ?
      
     <form>
        <div className="grid gap-y-4">
         
          <div>
            <Image
            src={userProfile.user_image || "https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"}
            width={200}
            alt="NextUI Fruit Image with Zoom"
            className='mb-8 ml-12 lg:ml-[17rem] md:ml-[6rem]'
            />
            <label for="email" className="block  text-sm mb-2 dark:text-white">First Name</label>
            <div className="relative">
              <input type="text" id="email" name="first_name" disabled value={userProfile.user.first_name || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] border-white rounded-lg text-sm " required aria-describedby="email-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
            
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Last Name</label>
             
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.user.last_name || ''}   className="py-3 px-4 font-bold block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
            
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Email</label>
             
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.user.email || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
            
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Phone</label>
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.user.phone || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>

          { Object.values(details).some(value => !value) && <div className='flex justify-center' ><h4 className='font-bold text-red-500'>**Complete your profile**</h4></div>}

          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Birth-Date</label>
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.birth_date || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Gender</label>
            </div>
            <div className="relative">
            <input type='text' disabled value={userProfile.gender || ''} className="py-3 font-bold px-4 bg-[#2A3240] pe-9 block w-full border-gray-200 rounded-lg text-sm "/>
            </div>
          </div>


          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Address</label>
             
            </div>
            <div className="relative">
              <textarea type="text" id="password" disabled value={userProfile.address || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
            
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Pincode</label>
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.pincode || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">Twon / City</label>
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.city || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>


          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">District</label>
            </div>
            <div className="relative">
              <input type="text" id="password" disabled value={userProfile.district || ''}   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>


          <div>
            <div className="flex justify-between items-center">
              <label for="password" className="block text-sm mb-2 dark:text-white">State</label>
            </div>
            <div className="relative">
              <input value={userProfile.state || ''} type="text" id="password"   className="py-3 font-bold px-4 block w-full bg-[#2A3240] rounded-lg text-sm " required aria-describedby="password-error"/>
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6  ">
          <Button onPress={onOpen} className='bg-gradient-to-r from-[#427EF5] to-[#274A8F]' size='md' variant="solid">
        {Object.values(details).some(value => !value) ? 'Complete Your Profile' : 'Edit Profile'}
      </Button>
      </div>
      </form>:
     <Spinner size="lg" className='' />
     }
    </div>
  </div>
    </div>

<Modal scrollBehavior='outside' isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1"> 'Edit Profile' </ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.user.first_name}
                                        label="First Name"
                                        labelPlacement='outside'
                                        name='first_name'
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.user.last_name || ''}
                                        label="Last Name"
                                        labelPlacement='outside'
                                        name="last_name"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.user.phone || ''}
                                        label="Phone"
                                        labelPlacement='outside'
                                        name="phone"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.birth_date || ''}
                                        label="Birth Date"
                                        labelPlacement='outside'
                                        type='date'
                                        name="birth_date"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.gender || ''}
                                        label="Gender"
                                        labelPlacement='outside'
                                        type='text'
                                        name="gender"
                                        
                                    />
                                    <Textarea
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.address || ''}
                                        label="Address"
                                        labelPlacement='outside'
                                        name="address"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        type='number'
                                        value={details.pincode || ''}
                                        label="Pincode"
                                        labelPlacement='outside'
                                        name="pincode"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.city || ''}
                                        label="City"
                                        labelPlacement='outside'
                                        name="city"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.district || ''}
                                        label="District"
                                        labelPlacement='outside'
                                        name="district"
                                        
                                    />
                                    <Input
                                        autoFocus
                                        onChange={handleInputChange}
                                        value={details.state || ''}
                                        label="State"
                                        labelPlacement='outside'
                                        name="state"
                                        
                                    />
                                    <div className="mt-2 flex justify-center align-middle">
                                      <Image
                                        isZoomed
                                        width={240}
                                        alt="User Image"
                                        src={file ? URL.createObjectURL(file) : (details.user_image || "https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg")}
                                      />
                                    </div>
                                    <input
                                      onChange={handleInputChange}
                                      className="block w-[15rem] ml-[5rem] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                      id="file_input"
                                      type="file"
                                      name="user_image"
                                    />
                                                        
                                                        
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" className='hover:bg-green-400' onPress={handleSubmit} >
                                        Update
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
     
    </>
  )
}

export default UserprofileForm