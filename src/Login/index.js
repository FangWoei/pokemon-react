import {
  PasswordInput,
  TextInput,
  Group,
  Text,
  Space,
  Button,
  Card,
  BackgroundImage,
  Image,
  Grid,
  Container,
  MediaQuery,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./login.css";
import ReactAudioPlayer from "react-audio-player";

export default function Login() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      // store user data into cookies
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 14, // expire in 14 days
      });
      // redirect to home
      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    // make sure email & password are not empty.
    if (!email || !password) {
      notifications.show({
        title: "Please fill in both email and password.",
        color: "red",
      });
    } else {
      loginMutation.mutate(
        JSON.stringify({
          email: email,
          password: password,
        })
      );
    }
  };

  return (
    <div>
      <BackgroundImage
        src="/images/login.png"
        sx={{
          height: "100vh",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          "@media screen and (max-width: 1200px)": {
            height: "auto",
          },
        }}>
        {/* <ReactAudioPlayer src="/images/Gym My Team.mp3" autoPlay loop /> */}
        <Container size="90%">
          <Space h={"50px"} />
          <Grid>
            <Grid.Col lg={4}>
              <Card
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}>
                <div class="login">
                  <form>
                    <a>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <div mx="auto">
                        <ul className="hello">
                          <li>L</li>
                          <li>o</li>
                          <li>g</li>
                          <li>i</li>
                          <li>n</li>
                        </ul>
                      </div>
                      <Image
                        src="/images/pokeball.gif"
                        mx={"auto"}
                        width={"200px"}
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
                      <Space h="20px" />
                      <Text style={{ color: "white", fontSize: "20px" }}>
                        Password
                      </Text>
                      <PasswordInput
                        value={password}
                        radius="xl"
                        placeholder="Password"
                        required
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <div class="login-box">
                        <form>
                            <a onClick={handleSubmit}>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              Login
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
                    to="/signup"
                    variant="subtle"
                    size="xs"
                    style={{ color: "yellow" }}>
                    If not account please come here
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col lg={5}></Grid.Col>
            <Grid.Col lg={3}>
              <MediaQuery query="(min-width: 768px)">
                <Space h="350px" />
              </MediaQuery>
              <MediaQuery query="(max-width: 767px)">
                <Space h="10px" />
              </MediaQuery>

              <Group>
                <div className="pikachu"></div>
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
        <Space h="105px" />
      </BackgroundImage>
    </div>
  );
}
