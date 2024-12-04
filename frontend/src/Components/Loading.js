import React from "react";

const Loading = () => {
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional translucent background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999, // Ensures it's above other elements
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "6px solid rgba(0, 0, 0, 0.1)",
      borderTop: "6px solid #000", // Color of the spinner
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Loading;
