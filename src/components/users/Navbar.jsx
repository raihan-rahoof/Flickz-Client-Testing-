import React, { useState, useEffect, useContext } from "react";
import "./nav.scss";
import { Link, useNavigate } from "react-router-dom";
import createAxiosInstance from "../../utlis/axiosinstance";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";
import {
  Navbar as NextUINavbar, 
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt_token = JSON.parse(localStorage.getItem("access"));
  const refresh_token = JSON.parse(localStorage.getItem("refresh"));
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const axiosInstance = createAxiosInstance("user");

  useEffect(() => {
    if (jwt_token && user) {
      testauth();
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [jwt_token, user, isLoggedIn]);

  const handleLogout = async () => {
    const res = await axiosInstance.post("/auth/logout/", {
      refresh_token: refresh_token,
      access_token: jwt_token,
    });
    if (res.status === 200) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
      toast.success("Logout success");
    }
  };

  const testauth = async () => {
    try {
      const res = await axiosInstance.get("/auth/testauth/");
      if (res.status === 200) {
        console.log("User is active:", res.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
        toast.error("Unauthorized. Logging out...");
      } else {
        console.error("Error while testing authentication:", error);
        handleLogout();
      }
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/home/movies/search/?q=${query}`);
        setSuggestions(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movie suggestions:", error);
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <NextUINavbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Link to='/' className=" sm:block font-bold text-xl text-blue-500">FLICKZ</Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="around">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            startContent={<i className="fa-solid fa-magnifying-glass"></i>}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-28 w-fit bg-transparent/60  rounded-lg">
              {suggestions.map((suggestion) => (
                <>
                  <div
                    key={suggestion.id}
                    className="p-2 hover:bg-black/80 w-[10.5rem] rounded-lg cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.id)}
                  >
                    {suggestion.title}
                  </div>
                </>
              ))}
            </div>
          )}
          {isLoggedIn ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <NavbarMenuToggle
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                  <Link to="/user-profile">Profile</Link>
                </DropdownItem>
                <DropdownItem key="analytics">
                  <Link to="/tickets">Tickets</Link>
                </DropdownItem>
                <DropdownItem key="help_and_feedback">
                  <Link to="/theatre">Watch History</Link>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="login-btn text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
            >
              Login
            </Link>
          )}
        </NavbarContent>
      </NextUINavbar>
    </>
  );
}

export default Navbar;
