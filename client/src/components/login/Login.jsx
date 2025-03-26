

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <button onClick={handleGoogleLogin} style={styles.button}>
      Sign in with Google
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#db4437",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Login;
