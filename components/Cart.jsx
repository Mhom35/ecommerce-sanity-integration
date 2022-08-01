import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client'; //images
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove} = useStateContext();

  // pay with stripe 
  const handleCheckout = async () => {
    const stripe = await getStripe();
    //now we make a request to our OWN nextjs backend
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    if(response.statusCode === 500) return;
    
    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <div className="cart-wrapper" ref={cartRef}>
    <div className="cart-container">
      <button
      type="button"
      className="cart-heading"
      onClick={() => setShowCart(false)}>
        <AiOutlineLeft />
        <span className="heading">Your Cart</span>
        <span className="cart-num-items">({totalQuantities} items)</span>
      </button>
{/* no items in shopping cart  */}
      {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
{/* when we have items in the cart -- mapping it  */}
        <div className="product-container">
        {/* mapping image */}
          {cartItems.length >= 1 && 
          cartItems.map((item, index) => (
            <div className="product" key={item._id}>
              <img src={urlFor(item?.image[0])}
              className="cart-product-image" />
          {/* price, desc, name */}
              <div className="item-desc">
                <div className="flex top">
                  <h5>{item.name}</h5>
                  <h4>${item.price}</h4>
                </div>
          {/* incr, dec Quantity feature */}
                <div className="flex bottom">
                  <div>
                {/* decrease quantity */}
                    <p className="quantity-desc">
                      <span className="minus" 
                      onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                        <AiOutlineMinus />
                      </span>
                      <span className="num" onClick="">
                      {item.quantity}
                      </span>
                  {/* INCREASE QUANTITY */}
                      <span className="plus" 
                      onClick={() => toggleCartItemQuantity(item._id, 'inc')}>
                        <AiOutlinePlus />
                      </span>
                    </p>
                  </div>
          {/* delete button */}
                  <button
                  type="button"
                  className="remove-item"
                  onClick= {() => onRemove(item)}
                  >
                    <TiDeleteOutline/>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
  {/* //Subtotal/ Stripe Payment method*/}
        {cartItems.length >= 1 && (
          <div className="cart-button">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
    {/* Pay with Stripe */}
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay With Stripe
              </button>

            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default Cart