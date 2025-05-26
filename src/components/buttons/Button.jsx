import React from 'react';

const Button = ({ label, onClick, className = 'btn btn-primary' }) => {
  return (
    <button className={className} onClick={onClick} type="submit">
      {label}
    </button>
  );
};

export default Button;
