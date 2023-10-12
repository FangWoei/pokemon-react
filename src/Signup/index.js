import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Grid,
  PasswordInput,
  BackgroundImage,
  Image,
  Text,
  MediaQuery,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import "./signup.css";

export default function Signup() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  // sign up mutation
  const signMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 14,
      });
      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  // handle submit
  const handleSubmit = () => {
    if (!name || !email || !password || !confirmPassword) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else if (password !== confirmPassword) {
      notifications.show({
        title: "Password and Confirm Password not match",
        color: "red",
      });
    } else {
      signMutation.mutate(
        JSON.stringify({
          name: name,
          email: email,
          password: password,
        })
      );
    }
  };

  return (
    <div>
      <BackgroundImage
        src="/images/signup.jpg"
        sx={{
          height: "100vh",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          "@media screen and (max-width: 1200px)": {
            height: "auto",
          },
        }}>
        <Container size="90%">
          {/* <ReactAudioPlayer src="/images/Gym My Team.mp3" autoPlay loop /> */}
          <Space h={"40px"} />
          <Grid>
            <Grid.Col lg={3} className="images">
              <Space h="400px" />
              <Image src="/images/login-pokeball.gif" />
            </Grid.Col>
            <Grid.Col lg={5}></Grid.Col>
            <Grid.Col lg={4}>
              <Card
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}>
                <div class="signup">
                  <form>
                    <a>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <div mx="auto">
                        <ul className="hello">
                          <li>S</li>
                          <li>i</li>
                          <li>g</li>
                          <li>n</li>
                          <li>U</li>
                          <li>p</li>
                        </ul>
                      </div>
                      <Image
                        src="/images/signup-wel.gif"
                        mx={"auto"}
                        width={"200px"}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: "20px",
                        }}>
                        Name
                      </Text>
                      <TextInput
                        value={name}
                        placeholder="Name"
                        required
                        radius="xl"
                        onChange={(event) => setName(event.target.value)}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: "20px",
                        }}>
                        Email
                      </Text>
                      <TextInput
                        value={email}
                        radius="xl"
                        placeholder="Email"
                        required
                        onChange={(event) => setEmail(event.target.value)}
                      />

                      <Text style={{ color: "white", fontSize: "20px" }}>
                        Password
                      </Text>
                      <PasswordInput
                        value={password}
                        placeholder="Password"
                        radius="xl"
                        visible={visible}
                        onVisibilityChange={toggle}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                      />

                      <Text style={{ color: "white", fontSize: "20px" }}>
                        Confirm Password
                      </Text>
                      <PasswordInput
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        radius="xl"
                        visible={visible}
                        onVisibilityChange={toggle}
                        required
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                      <div class="signup-box">
                        <form>
                          <a onClick={handleSubmit}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Sign up
                          </a>
                        </form>
                      </div>
                      <Space h={"20px"} />
                    </a>
                  </form>
                </div>
                <Group position="apart">
                  <Button
                    component={Link}
                    to="/"
                    variant="subtle"
                    size="xs"
                    style={{ color: "yellow" }}>
                    Back
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="subtle"
                    size="xs"
                    style={{ color: "yellow" }}>
                    If have account please come here
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </BackgroundImage>
    </div>
  );
}
