import React, { useContext } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import createAxiosInstance from "../../../utlis/axiosinstance";
import TheatreAuthContext from "../../../Context/TheatreAuthContext";

export default function TheatreNav(props) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {isTheatreLoggedIn, setIsTheatreLoggedIn} = useContext(TheatreAuthContext)

  const theatre = JSON.parse(localStorage.getItem('theatre'))
  const access = JSON.parse(localStorage.getItem('theatre_access'))
  const refresh = JSON.parse(localStorage.getItem('theatre_refresh'))
  const navigate = useNavigate()

  const axiosInstance = createAxiosInstance('theatre')

  const handleLogout = async () => {
    const res = await axiosInstance.post('/auth/logout/', { 'refresh_token': refresh, 'access_token': access })
    if (res.status === 200) {
      localStorage.removeItem('theatre_access');
      localStorage.removeItem('theatre_refresh');
      localStorage.removeItem('theatre');
      setIsTheatreLoggedIn(false)
      navigate('/theatre/login')
    }
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-[#1b1818]">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <h1 className="font-bold text-xl ">FLICKZ.</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <RouterLink to='/theatre/dashboard' className={`hover:cursor-pointer ${props.now === 'dashboard' && 'text-indigo-500'}`}>
            Dashboard
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink to='/theatre/shows' className={`hover:cursor-pointer ${props.now === 'Shows' && 'text-indigo-500'}`}>
            Shows
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink to='/theatre/screens' className={`hover:cursor-pointer ${props.now === 'screens' && 'text-indigo-500'}`}>
            Screens
          </RouterLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={RouterLink} onClick={handleLogout} className="bg-indigo-500" to="#">
            Log out
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <RouterLink to='/theatre/dashboard' className={`${props.now === 'dashboard' && 'text-indigo-500'}`}>
            Dashboard
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink to='/theatre/shows' className={`${props.now === 'Shows' && 'text-indigo-500'}`}>
            Shows
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink to='/theatre/screens' className={`${props.now === 'screens' && 'text-indigo-500'}`}>
            Screens
          </RouterLink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
