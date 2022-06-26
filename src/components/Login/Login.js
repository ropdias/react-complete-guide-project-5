import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

// emailReducer will be triggered when the dispatchEmail is called
// and the action holds the object we passed to dispatchEmail
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    // If we use the state snapshot we can guarantee this is the last one.
    // that state is an object with the same attributes we set in the initialState of the reducer
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false }; // default state if no other action returns
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    // If we use the state snapshot we can guarantee this is the last one.
    // that state is an object with the same attributes we set in the initialState of the reducer
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false }; // default state if no other action returns
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  // We will use object destructuring to pull out certain properties of objects
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // its okay to update a state inside a useEffect() because you have a guarantee that the state is the last one if it's on the dependencies
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking...");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    // You can return a "cleanup function" from the useEffect() hook that will run BEFORE the useEffect()
    // function runs, except for the very first time when it runs.
    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier); // built-in into the browser. We clear the timer before we set a new one.
    };
    // If we stay with [emailState, passwordState] this might run too often because this effect will 
    // run whenever the value changes and we just want to check the validity. So we can use emailState.isValid or
    // use object destructuring to add object properties as dependencies to useEffect()
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // This was not okay to update a state based on another one, its better to use useEffect() to get the last state of that other state
    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const validateEmailHandler = () => {
    // We dont need to add a value here necessarily, because all we care about here
    // is when the input lost focus, there is no extra data we needs to add
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
