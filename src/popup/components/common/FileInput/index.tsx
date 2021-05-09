import React from "react";

function FileInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { children, ...otherProps } = props;

  return <input type="file" {...otherProps} />;
}

export default FileInput;
