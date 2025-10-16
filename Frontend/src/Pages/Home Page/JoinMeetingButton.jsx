import React from 'react';
import styled from 'styled-components';

const JoinMeetingButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>Connect</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
  overflow: visible;
  padding: 10px;

  button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #fff; /* default text color */
    background-color: #ff5252;
    border: 2px solid #000;
    border-radius: 10px;
    box-shadow: 5px 5px 0px #000;
    transition: all 0.3s ease;
    cursor: pointer;
    transform-origin: center;
  }

  button:hover {
    background-color: #fff;
    color: #000 !important; /* force text color to black */
    border: 2px solid #ff5252;
    box-shadow: 5px 5px 0px #ff5252;
    transform: scale(1.05);
  }

  button:active {
    background-color: #fcf414;
    box-shadow: none;
    transform: scale(0.98) translateY(4px);
  }
`;

export default JoinMeetingButton;
