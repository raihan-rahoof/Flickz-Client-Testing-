import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { NextUIProvider } from "@nextui-org/system";
import './index.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/users/Home';
import Login from './pages/users/auth/Login';
import Register from './pages/users/auth/Register';
import Otp from './pages/users/auth/Otp';
import ResetPassword from './pages/users/auth/ResetPassword';
import ChangePassword from './pages/users/auth/ChangePassword';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './pages/admin/auth/AdminLogin';
import UserPage from './pages/admin/auth/UserPage';
import Movie from './pages/admin/movies/Movie';
import AddMovie from './pages/admin/movies/AddMovie';
import { AuthProvider } from './Context/AuthContext';
import { AdminAuthProvider } from './Context/AdminAuthContext';
import MoveDetails from './pages/users/MoveDetails';
import TheatreRegister from './pages/theatre/TheatreRegister';
import TheatreLogin from './pages/theatre/TheatreLogin';
import TheatreOtp from './pages/theatre/TheatreOtp';
import TheatreList from './pages/admin/theatre/TheatreList';
import Theatre from './pages/theatre/Theatre';
import TheatreDashboard from './pages/theatre/theatreManagment/TheatreDashboard';
import UserProfile from './pages/users/Profile/UserProfile';
import TheatreShows from './pages/theatre/theatreManagment/TheatreShows';
import TheatreScreens from './pages/theatre/theatreManagment/TheatreScreens';
import TheatreSeatLayoutEdit from './components/Theatre/TheatreSeatLayoutEdit';
import AvailabeTheatres from './pages/users/AvailabeTheatres';
import SelectSeat from './pages/users/SelectSeat';
import PaymentFailed from './components/users/movie-details/PaymentFailed';
import PaymentSuccess from './components/users/movie-details/PaymentSuccess';
import TicketDetails from './pages/users/Profile/TicketDetails';
import PrivateRoute from './utlis/PrivateRoute';
import TicketDetailPage from './pages/users/Profile/TicketDetailView';
import AdminPrivateRoute from './utlis/AdminPrivateRoute';
import { TheatreAuthProvider } from './Context/TheatreAuthContext';
import TheatrePrivateRoute from './utlis/TheatrePrivateRoute';
import TheatreShowMgmt from './pages/theatre/theatreManagment/TheatreShowMgmt';
import TheatreSideSeatBooking from './pages/theatre/theatreManagment/TheatreSideSeatBooking';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import TheatreProfile from './pages/theatre/theatreManagment/TheatreProfile';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AdminAuthProvider>
      <TheatreAuthProvider>
        <NextUIProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/otp" element={<Otp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/reset-password-confirm/:uid/:token"
                element={<ChangePassword />}
              />
              <Route path="/movie/:id" element={<MoveDetails />} />
              <Route
                path="/user-profile"
                element={<PrivateRoute element={UserProfile} />}
              />
              <Route
                path="/tickets"
                element={<PrivateRoute element={TicketDetails} />}
              />
              <Route
                path="/tickets/details/:id"
                element={<PrivateRoute element={TicketDetailPage} />}
              />
              <Route
                path="/movie/available-shows/:id"
                element={<PrivateRoute element={AvailabeTheatres} />}
              />
              <Route
                path="/movie/select-seat"
                element={<PrivateRoute element={SelectSeat} />}
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />

              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashBoard />} />
              <Route
                path="/admin/user-list"
                element={<AdminPrivateRoute element={UserPage} />}
              />
              <Route
                path="/admin/movies"
                element={<AdminPrivateRoute element={Movie} />}
              />
              <Route
                path="/admin/add-movie"
                element={<AdminPrivateRoute element={AddMovie} />}
              />
              <Route
                path="/admin/theatres"
                element={<AdminPrivateRoute element={TheatreList} />}
              />

              <Route path="/theatre" element={<Theatre />} />
              <Route path="/theatre/register" element={<TheatreRegister />} />
              <Route path="/theatre/login" element={<TheatreLogin />} />
              <Route path="/theatre/verify-email" element={<TheatreOtp />} />
              <Route
                path="/theatre/dashboard"
                element={<TheatrePrivateRoute element={TheatreDashboard} />}
              />
              <Route
                path="/theatre/shows"
                element={<TheatrePrivateRoute element={TheatreShows} />}
              />
              <Route
                path="/theatre/screens"
                element={<TheatrePrivateRoute element={TheatreScreens} />}
              />
              <Route
                path="/theatre/profile"
                element={<TheatrePrivateRoute element={TheatreProfile} />}
              />

              <Route
                path="/theatre/screens/edit-layout/:screenId"
                element={
                  <TheatrePrivateRoute element={TheatreSeatLayoutEdit} />
                }
              />
              <Route
                path="/theatre/show/manage"
                element={<TheatrePrivateRoute element={TheatreShowMgmt} />}
              />
              <Route
                path="/theatre/show/manage/seats"
                element={
                  <TheatrePrivateRoute element={TheatreSideSeatBooking} />
                }
              />
            </Routes>
          </Router>
        </NextUIProvider>
      </TheatreAuthProvider>
    </AdminAuthProvider>
  </AuthProvider>
);
