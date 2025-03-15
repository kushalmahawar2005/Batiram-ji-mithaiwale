import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your_publishable_key');

const CheckoutForm = ({ total, items }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    // Here you would typically make a call to your backend to process the payment
    // and create an order
    try {
      // Replace with your backend API endpoint
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: total,
          billingDetails,
          items,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        // Handle successful payment
        window.location.href = '/order-confirmation';
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="billing-details">
        <h3>Billing Details</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={billingDetails.name}
            onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            required
            value={billingDetails.email}
            onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="tel"
            placeholder="Phone"
            required
            value={billingDetails.phone}
            onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Address"
            required
            value={billingDetails.address.line1}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, line1: e.target.value }
            })}
          />
        </div>
        <div className="form-row three-columns">
          <input
            type="text"
            placeholder="City"
            required
            value={billingDetails.address.city}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="State"
            required
            value={billingDetails.address.state}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, state: e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="PIN Code"
            required
            value={billingDetails.address.postal_code}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, postal_code: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="payment-details">
        <h3>Payment Details</h3>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="pay-button"
      >
        {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
      </button>

      <div className="security-badges">
        <div className="badge">
          <i className="fas fa-lock"></i>
          <span>Secure Payment</span>
        </div>
        <div className="badge">
          <i className="fas fa-shield-alt"></i>
          <span>SSL Encrypted</span>
        </div>
      </div>
    </form>
  );
};

const Checkout = ({ total, items }) => {
  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-form">
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} items={items} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 