import React from 'react';
import styled from 'styled-components';

const Input = ({ labelText, value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="wave-group">
        <input
          required
          type="text"
          className="input"
          value={value}
          onChange={onChange}
        />
        <span className="bar" />
        <label className="label">
          {[...labelText].map((char, i) => (
            <span key={i} className="label-char" style={{ "--index": i }}>
              {char === ' ' ? "\u00A0" : char}
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
    font-size: 20px;
    padding: 12px 10px 12px 8px;
    display: block;
    width: 300px;
    max-width: 90%;
    border: none;
    border-bottom: 2px solid #00e5ff;
    background: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    caret-color: #ffffff;
    border-radius: 6px;
  }

  .wave-group .input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .wave-group .input:focus {
    outline: none;
    color: #ffffff;
  }

  .wave-group .label {
    color: #999;
    font-size: 20px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 8px;
    top: 12px;
    display: flex;
  }

  .wave-group .label-char {
    transition: 0.2s ease all;
    transition-delay: calc(var(--index) * 0.05s);
  }

  .wave-group .input:focus ~ label .label-char,
  .wave-group .input:valid ~ label .label-char {
    transform: translateY(-26px);
    font-size: 16px;
    color: #00e5ff;
  }

  .wave-group .bar {
    position: relative;
    display: block;
    width: 300px;
    max-width: 90%;
  }

  .wave-group .bar:before,
  .wave-group .bar:after {
    content: '';
    height: 3px;
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