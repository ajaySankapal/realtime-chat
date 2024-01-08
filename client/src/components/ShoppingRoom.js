import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./UI/Input";
import io from 'socket.io-client'
import ChatWindow from "./ChatWindow";
import { CHAT_SERVER_URL } from "../constants/URLConstants";
const ShoppingCartForm = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false)
  const [itemValue, setItemValue] = useState("");
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      customerName: "",
      contactNumber: "",
      items: "",
      deliveryDate: "",
    },
  });

  const handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      if (itemValue) {
        setItems((prevItems) => [...prevItems, itemValue]);
        setItemValue("");
      }
    }
  };

  const handleChange = (evt) => {
    setError(false)
    setItemValue(evt.target.value);
  };

  const handleDelete = (item) => {
    let filteredItems = items.filter((i) => i !== item);
    setItems(filteredItems);
  };

  const onSubmit = (data) => {
    if (items.length < 1) {
      setError(true)
      return
    }
    console.log({ ...data, items });
    socketRef.current.emit('join', { ...data, items });
    setItems([])
    reset()
    setError(false)
  }

  useEffect(() => {
    socketRef.current = io.connect(CHAT_SERVER_URL);
    socketRef.current.on("message", (message) => {
      console.log(message)
      setMessages((prevMessages) => [...prevMessages, message])
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socketRef.current.disconnect();
    };

  }, [])

  return (
    <>
      {messages.length === 0 ?
        <div className="bg-white p-10 w-full md:w-[45%] mx-auto rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-2 flex flex-col">
              <Input
                label="Customer Name"
                {...register("customerName", { required: 'Customer name is required' })}
                className={errors.customerName ? `border border-red-500` : ``}
              />
              {errors.customerName && (
                <p className="text-red-500">{errors.customerName.message}</p>
              )}
            </div>
            <div className="p-2 flex flex-col">
              <Input
                label="Contact Number"
                {...register("contactNumber", {
                  required: 'Contact number is required', maxLength: {
                    value: 10,
                    message: "Contact number should be at most 10 digits",
                  },
                })}
                type='number'
                className={errors.contactNumber ? `border border-red-500` : ``}
              />
              {errors.contactNumber && (
                <p className="text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>
            <div className="p-2">

              <div className="flex flex-row">
                <label className="inline-block mb-1 pl-1">Items</label>

                <div className="flex flex-wrap ml-2">
                  {items.map((item) => (
                    <div className="tag-item" key={item}>
                      {item}
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleDelete(item)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <Input
                value={itemValue}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                className={isSubmitted && error ? 'border border-red-500' : ''}
              />
              {isSubmitted && error && (
                <p className="text-red-500">Items are required.</p>
              )}
            </div>

            <div className="p-2 flex flex-col">
              <Input
                label="Expected Delivery Date"
                type='date'
                {...register("deliveryDate", { required: 'Expected delivery time is required.' })}
                className={errors.deliveryDate ? `border border-red-500` : ``}
              />
              {errors.deliveryDate && (
                <p className="text-red-500">{errors.deliveryDate.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white shadow-lg py-3 rounded-md my-3"
            >
              Place Order
            </button>
          </form>
        </div > :
        <ChatWindow socket={socketRef.current} messages={messages} />
      }
    </>
  );
};

export default ShoppingCartForm;
