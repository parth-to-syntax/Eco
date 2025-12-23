import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayCheckout = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
  className = "",
  children = "Pay Now"
}) => {
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast({
        title: "Payment Error",
        description: "Razorpay SDK failed to load. Please check your internet connection.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: 'rzp_test_xxxxxxxx', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Thrift Earth',
      description: 'Purchase from Thrift Earth',
      image: '/favicon.ico',
      handler: function (response) {
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
        onSuccess();
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Thrift Earth Corporate Office'
      },
      theme: {
        color: 'hsl(var(--primary))'
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by user",
            variant: "destructive",
          });
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment failed:', error);
      if (onError) onError(error);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};