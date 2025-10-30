import React from 'react';
import styled from 'styled-components';

const LogoutButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <div>
        <button className="animated-button" onClick={onClick}>
          <svg
            viewBox="0 0 24 24"
            className="arr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </svg>
          <span className="text">Logout</span>
          <span className="circle" />
          <svg
            viewBox="0 0 24 24"
            className="arr-1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </svg>
        </button>
        <br />
        <br />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 16px 36px;
    border: 4px solid;
    border-color: transparent;
    font-size: 16px;
    background-color: inherit;
    border-radius: 100px;
    font-weight: 600;
    color: rgb(47, 248, 255);
    box-shadow: 0 0 0 2px rgb(47, 255, 238);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    margin-top: 2rem;
    white-space: nowrap;
    min-width: fit-content;
  }

  .animated-button svg {
    position: absolute;
    width: 24px;
    fill: rgb(47, 255, 255);
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    flex-shrink: 0;
  }

  .animated-button .arr-1 {
    right: 16px;
  }

  .animated-button .arr-2 {
    left: -25%;
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: rgb(47, 224, 255);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:hover {
    box-shadow: 0 0 0 12px transparent;
    color: #212121;
    border-radius: 12px;
  }

  .animated-button:hover .arr-1 {
    right: -25%;
  }

  .animated-button:hover .arr-2 {
    left: 16px;
  }

  .animated-button:hover .text {
    transform: translateX(12px);
  }

  .animated-button:hover svg {
    fill: #212121;
  }

  .animated-button:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px greenyellow;
  }

  .animated-button:hover .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }

  /* Tablet and medium screens */
  @media (max-width: 768px) {
    .animated-button {
      padding: 12px 28px;
      font-size: 14px;
      margin-top: 1.5rem;
    }

    .animated-button svg {
      width: 20px;
    }

    .animated-button .arr-1 {
      right: 14px;
    }

    .animated-button:hover .arr-2 {
      left: 14px;
    }

    .animated-button:hover .circle {
      width: 180px;
      height: 180px;
    }
  }

  /* Specific fix for 412px width screens */
  @media (max-width: 420px) {
    .animated-button {
      font-size: 12px;
      padding: 10px 22px;
      gap: 3px;
      margin-top: 1.2rem;
      border: 3px solid;
    }

    .animated-button svg {
      width: 18px;
    }

    .animated-button .text {
      transform: translateX(-8px);
    }

    .animated-button:hover .text {
      transform: translateX(8px);
    }

    .animated-button .arr-1 {
      right: 12px;
    }

    .animated-button:hover .arr-2 {
      left: 12px;
    }

    .animated-button:hover .circle {
      width: 150px;
      height: 150px;
    }
  }

  /* Specific fix for 344px width screens */
  @media (max-width: 380px) {
    .animated-button {
      font-size: 10.5px;
      padding: 8px 16px;
      gap: 2px;
      margin-top: 1rem;
      border: 2.5px solid;
    }

    .animated-button svg {
      width: 15px;
    }

    .animated-button .text {
      transform: translateX(-5px);
    }

    .animated-button:hover .text {
      transform: translateX(5px);
    }

    .animated-button .arr-1 {
      right: 9px;
    }

    .animated-button .arr-2 {
      left: -18%;
    }

    .animated-button:hover .arr-2 {
      left: 9px;
    }

    .animated-button:hover .circle {
      width: 120px;
      height: 120px;
    }
  }

  /* Very small screens (320px and below) */
  @media (max-width: 320px) {
    .animated-button {
      font-size: 10px;
      padding: 8px 16px;
      gap: 2px;
      margin-top: 0.8rem;
      border: 2px solid;
    }

    .animated-button svg {
      width: 14px;
    }

    .animated-button .text {
      transform: translateX(-5px);
    }

    .animated-button:hover .text {
      transform: translateX(5px);
    }

    .animated-button .arr-1 {
      right: 9px;
    }

    .animated-button .arr-2 {
      left: -18%;
    }

    .animated-button:hover .arr-2 {
      left: 9px;
    }

    .animated-button:hover .circle {
      width: 110px;
      height: 110px;
    }
  }

  /* Large screens */
  @media (min-width: 1200px) {
    .animated-button {
      padding: 18px 40px;
      font-size: 17px;
    }

    .animated-button svg {
      width: 26px;
    }

    .animated-button:hover .circle {
      width: 240px;
      height: 240px;
    }
  }

  /* Extra large screens */
  @media (min-width: 1600px) {
    .animated-button {
      padding: 20px 44px;
      font-size: 18px;
      margin-top: 2.5rem;
    }

    .animated-button svg {
      width: 28px;
    }

    .animated-button:hover .circle {
      width: 260px;
      height: 260px;
    }
  }
`;

export default LogoutButton;