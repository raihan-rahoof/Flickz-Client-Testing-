import React,{useState} from 'react'
import Navbar from '../../../components/users/Navbar'
import UserprofileForm from '../../../components/users/Profile-components/UserprofileForm'

function UserProfile() {
  const [userProfile,setProfile] = useState(null)
  return (
    <>
    <Navbar/>
    <div className={userProfile ? 'h-full flex justify-center items-center ' : 'h-screen flex justify-center items-center'}>
    <UserprofileForm userProfile={userProfile} setProfile={setProfile} />
    </div>
    </>
  )
}

export default UserProfile