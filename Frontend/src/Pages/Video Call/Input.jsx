import React from 'react';
import styled from 'styled-components';

const Input = ({ label, value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="group">
        <input
          required
          type="text"
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" " // required for :placeholder-shown trick
        />
        <span className="highlight" />
        <span className="bar" />
        <label>{label}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .group {
    position: relative;
    margin: 20px 0;
  }

  .input {
    font-size: 16px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 220px;
    border: none;
    border-bottom: 2px solid #888; /* lighter underline */
    background: transparent;
    color: #fff; /* text color white for black background */
  }

  .input:focus {
    outline: none;
    border-bottom-color: #37FF8B; /* highlight underline color */
  }

  label {
    color: #bbb; /* label color visible on black */
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    transition: 0.2s ease all;
  }

  /* Trigger animation when input is focused or has value */
  .input:focus ~ label,
  .input:not(:placeholder-shown) ~ label {
    top: -20px;
    font-size: 14px;
    color: #37FF8B; /* animated label color */
  }

  .bar {
    position: relative;
    display: block;
    width: 220px;
  }

  .bar:before,
  .bar:after {
    content: '';
    height: 2px;
    width: 0;
    bottom: 0;
    position: absolute;
    background: #37FF8B; /* animated bar color */
    transition: 0.2s ease all;
  }

  .bar:before {
    left: 50%;
  }

  .bar:after {
    right: 50%;
  }

  .input:focus ~ .bar:before,
  .input:focus ~ .bar:after {
    width: 50%;
  }

  .highlight {
    position: absolute;
    height: 60%;
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.3;
  }

  .input:focus ~ .highlight {
    animation: inputHighlighter 0.3s ease;
  }

  @keyframes inputHighlighter {
    from {
      background: #37FF8B; /* highlight color */
    }
    to {
      width: 0;
      background: transparent;
    }
  }
`;

export default Input;
