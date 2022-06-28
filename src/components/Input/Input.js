import React, { useRef, useImperativeHandle } from "react";

import classes from "./Input.module.css";

// 99,9% of the time props is all we will need but we can accept a second argument if a ref should 
// be set from outside to bind it with that ref and establish a connection
// For that we need to wrap our component with React.forwardRef() and pass our component as an argument
// and then we can receive a React Component that is capable of being bound to a ref.
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  // We could use useEffect() with ref to manipulate the DOM and focus the element after it renders
  // But this is not the behavior we want here. We will create a function to manipulate it from the outside when we want.
  //   useEffect(() => {
  //     inputRef.current.focus();
  //   }, []);

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
        focus: activate // We can use any name we want here to call from the outside instead of "focus"
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
