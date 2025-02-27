import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../constants";

import { useNavigate } from "react-router-dom";
import { localStorageSetter } from "../helpers/localstorage";
import restClient from "../helpers/restClient";
import TextInput from "./Input/TextInput";

function SingUp({ onChangeSignup }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [snackState, setSnackState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = snackState;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await restClient.post(`${SERVER}/users`, user);
      localStorageSetter(data.token, data.user);

      setSnackState({ ...snackState, open: true });
      setUser({
        name: "",
        email: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/movies");
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextInput
        id="name"
        label="Username"
        value={user.name}
        onChange={handleChange}
      />
      <TextInput
        type="email"
        id="email"
        label="Email Address"
        value={user.email}
        onChange={handleChange}
      />
      <TextInput
        type="password"
        id="password"
        label="Password"
        value={user.password}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
      <Typography
        fontSize={18}
        sx={{ mr: -28, mt: 2, cursor: "pointer" }}
        color="blue"
        onClick={() => onChangeSignup()}
      >
        Already Have an account! Login
      </Typography>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={() => setSnackState({ ...snackState, open: false })}
        message="Account Successfully Created!"
        key={vertical + "right"}
      />
    </Box>
  );
}

function Login({ onChangeLogin }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(SERVER, user);
      localStorageSetter(data.token, data.user);
      navigate(data.user.isAdmin ? "/admin/movies" : "/movies");
    } catch (e) {
      console.log(e);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={user.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={user.password}
        onChange={handleChange}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Login
      </Button>
      <Typography
        fontSize={18}
        sx={{ mr: -50, mt: 2, cursor: "pointer" }}
        color="blue"
        onClick={() => onChangeLogin()}
      >
        SignUp
      </Typography>
    </Box>
  );
}
export default function Authenticate() {
  const [isLogin, setIsLogin] = useState(true);

  function handleLogin() {
    setIsLogin((prev) => !prev);
  }
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" color="black">
          {isLogin ? "Login" : "SignUp"}
        </Typography>
        {isLogin ? (
          <Login onChangeLogin={handleLogin} />
        ) : (
          <SingUp onChangeSignup={handleLogin} />
        )}
      </Box>
    </Container>
  );
}
