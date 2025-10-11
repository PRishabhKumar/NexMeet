import React from 'react';
import styled from 'styled-components';

const Input = ({ labelText = "Name" }) => {
  return (
    <StyledWrapper>
      <div className="wave-group">
        <input required type="text" className="input" />
        <span className="bar" />
        <label className="label">
          {[...labelText].map((char, i) => (
            <span key={i} className="label-char" style={{ "--index": i }}>
              {char == ' ' ? "\u00A0" : char}
            </span>
          ))}
        </label>
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .wave-group {
    position: relative;
  }

  .wave-group .input {
    font-size: 20px; /* increased font size */
    padding: 12px 10px 12px 8px; /* adjusted padding for bigger text */
    display: block;
    width: 300px; /* increased width */
    max-width: 90%; /* responsive */
    border: none;
    border-bottom: 2px solid #00e5ff; /* slightly thicker underline */
    background: transparent;
    color: white;
  }

  .wave-group .input:focus {
    outline: none;
  }

  .wave-group .label {
    color: #999;
    font-size: 20px; /* match input size */
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 8px;
    top: 12px;
    display: flex;
  }

  .wave-group .label-char {
    transition: 0.2s ease all;
    transition-delay: calc(var(--index) * .05s);
  }

  .wave-group .input:focus ~ label .label-char,
  .wave-group .input:valid ~ label .label-char {
    transform: translateY(-26px); /* slightly higher to match bigger font */
    font-size: 16px;
    color: #00e5ff;
  }

  .wave-group .bar {
    position: relative;
    display: block;
    width: 300px; /* match input width */
    max-width: 90%;
  }

  .wave-group .bar:before,
  .wave-group .bar:after {
    content: '';
    height: 3px; /* slightly thicker */
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #00e5ff;
    transition: 0.2s ease all;
  }

  .wave-group .bar:before {
    left: 50%;
  }

  .wave-group .bar:after {
    right: 50%;
  }

  .wave-group .input:focus ~ .bar:before,
  .wave-group .input:focus ~ .bar:after {
    width: 50%;
  }
`;

export default Input;
