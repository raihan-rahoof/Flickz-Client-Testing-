import React, { useState, useEffect, useContext } from 'react';
import './nav.scss';
import { Link, useNavigate } from 'react-router-dom';
import createAxiosInstance from '../../utlis/axiosinstance';
import { toast } from 'react-toastify';
import AuthContext from '../../Context/AuthContext';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";

function Navbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const jwt_token = JSON.parse(localStorage.getItem('access'));
    const refresh_token = JSON.parse(localStorage.getItem('refresh'));
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const axiosInstance = createAxiosInstance('user');

    useEffect(() => {
        if (jwt_token && user) {
            testauth();
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [jwt_token, user, isLoggedIn]);

    const handleLogout = async () => {
        const res = await axiosInstance.post('/auth/logout/', { 'refresh_token': refresh_token, 'access_token': jwt_token });
        if (res.status === 200) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            navigate('/login');
            toast.success('Logout success');
        }
    }

    const testauth = async () => {
        try {
            const res = await axiosInstance.get('/auth/testauth/');
            if (res.status === 200) {
                console.log('User is active:', res.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleLogout();
                toast.error('Unauthorized. Logging out...');
            } else {
                console.error('Error while testing authentication:', error);
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
                console.error('Error fetching movie suggestions:', error);
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    return (
        <>
            <nav className="bg-transparent">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FLICKZ</span>
                    </a>
                    <div className="nav-right flex gap-2">
                        <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search icon</span>
                            </div>
                            <input
                                type="text"
                                id="search-navbar"
                                className="hover:border-blue-500 block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {suggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-transparent/60  rounded-lg mt-1">
                                    {suggestions.map((suggestion) => (
                                        <>
                                       
                                        <div
                                            key={suggestion.id}
                                            className="p-2 hover:bg-black/80 cursor-pointer"
                                            onClick={() => handleSuggestionClick(suggestion.id)}
                                        >
                                            {suggestion.title}
                                        </div>
                                        </>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            {isLoggedIn ?
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Avatar
                                            isBordered
                                            as="button"
                                            color="primary"
                                            className="transition-transform"
                                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                                        <DropdownItem key="profile" className="h-14 gap-2">
                                            <p className="font-semibold">Signed in as</p>
                                            <p className="font-semibold">{user.email}</p>
                                        </DropdownItem>
                                        <DropdownItem key="settings">
                                            <Link to='/user-profile'>Profile</Link>
                                        </DropdownItem>
                                        <DropdownItem key="analytics">
                                            <Link to='/tickets'>Tickets</Link>
                                        </DropdownItem>
                                        <DropdownItem key="help_and_feedback">
                                            Rewards
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                :
                                <Link to='/login' className="login-btn text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center ">Login</Link>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
