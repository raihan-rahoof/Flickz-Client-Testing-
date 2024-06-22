import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import createAxiosInstance from '../../../utlis/axiosinstance';
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const axiosinstance = createAxiosInstance('user');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const session_id = new URLSearchParams(window.location.search).get('session_id');

      if (session_id) {
        try {
          const response = await axiosinstance.get(`/booking/payment-success?session_id=${session_id}`);

          if (response.status === 200) {
            setBooking(response.data);
            console.log('Payment successful');
          } else {
            console.log('Payment confirmation failed');
          }
        } catch (error) {
          console.error('Error fetching payment status:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPaymentStatus();
  }, [navigate]);

  console.log(booking);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Error loading payment details.</div>;
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className="max-w-[400px]">
        <CardHeader className="flex flex-col">
          <DotLottieReact
            src="https://lottie.host/770c089d-2503-4f6b-9fb5-c2272badb1aa/bomif3LSTd.lottie"
            loop
            autoplay
          />
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-center">Payment Successful</p>
            <p className="text-sm text-center">
              Thank you for choosing FLICKZ! <br /> We hope you enjoy your movie experience.
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardFooter className='flex justify-center items-center'>
          <Link
            isExternal
            showAnchorIcon
            to='/tickets'
            className='text-primary'
          >
            See your Ticket Details
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
