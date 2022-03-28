import { useState } from "react";

const useInput = (condition, initValue) => {
  const [value, setValue] = useState(initValue ? initValue : "");
  const [blur, setBlur] = useState(false);
  const valid = condition(value);
  const changeHandler = (e) => {
    setValue(e.target.value);
  };
  const resetHandler = () => {
    setValue("");
  };
  const blurHandler = () => {
    setBlur(true);
  };

  return {
    value,
    valid,
    changeHandler,
    resetHandler,
    blurHandler,
    blur,
  };
};

export default useInput;
