import "./App.css";
import {
  Input,
  Stack,
  FormControl,
  Button,
  Flex,
  Heading,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleOnSubmit(e) {
    e.preventDefault();

    if (!username) {
      setIsInvalid(true);
      setErrorMessage("Email is required");
      return;
    }

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(({ success }) => {
        if (!success) {
          setErrorMessage("Login failed.");
        }
        setIsSuccessful(success);
        setIsInvalid(!success);
      });
  }

  function handleOnChange(e) {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  return (
    <div className="App">
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Welcome</Heading>
        <form onSubmit={handleOnSubmit} autoComplete="off">
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl>
              <Input
                name="username"
                type="text"
                placeholder="Email"
                onChange={handleOnChange}
                value={username}
                autoComplete="new-password"
              />
            </FormControl>
            <FormControl>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleOnChange}
                value={password}
              />
            </FormControl>
            <FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </FormControl>
            <FormControl>
              {isInvalid && (
                <Alert status="error">
                  <AlertIcon />
                  {errorMessage}
                </Alert>
              )}
              {isSuccessful && (
                <Alert status="success">
                  <AlertIcon />
                  Login successful!
                </Alert>
              )}
            </FormControl>
          </Stack>
        </form>
      </Flex>
    </div>
  );
}

export default App;
