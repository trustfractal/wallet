import React from "react";

type ButtonProps = {
  loading: boolean;
};

Button.defaultProps = {
  loading: false,
};

function Button(
  props: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { loading, disabled, children, ...otherProps } = props;

  return (
    <button disabled={disabled || loading} {...otherProps}>
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
