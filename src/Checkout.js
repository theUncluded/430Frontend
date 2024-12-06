import React from 'react';
import './Checkout.css'; // CSS file for checkout-specific styles

function Checkout() {
  return (
    <div className="CheckoutPage">
      <h1>Checkout Page</h1>
      {/* Inform the user about the purpose of the checkout page */}
      <p>This is where you can review your cart items and complete your purchase.</p>
    </div>
  );
}

// Export the Checkout component
export default Checkout;
