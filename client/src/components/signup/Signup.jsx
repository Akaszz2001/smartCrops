
const Signup = () => {
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Signup with Google</h1>
      <button
        onClick={handleGoogleSignup}
        style={{
          background: "#4285F4",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Signup with Google
      </button>
    </div>
  );
};

export default Signup;