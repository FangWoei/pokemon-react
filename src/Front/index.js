import {
  BackgroundImage,
  Image,
  Card,
  Container,
  Group,
  Space,
  Button,
  Grid,
} from "@mantine/core";
import { Link } from "react-router-dom";
import "./front.css";
import ReactAudioPlayer from "react-audio-player";
export default function Front() {
  return (
    <div>
      <BackgroundImage
        src="/images/fullbackground.jpg"
        style={{
          height: "100vh",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}>
        <Container>
          <Space h="200px" />
          <Group position="center">
            <Card radius="lg" w="800px">
              <BackgroundImage src="/images/background.png" radius="lg">
                <Space h="200px" />
                <Grid>
                  <Grid.Col md={6} lg={6}>
                    <Button
                      component={Link}
                      to="/login"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <button className="btn-1 custom-btn">
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          Click!
                          <Image src="/images/icons.png" width="50px" />
                        </span>
                        <span>Login</span>
                      </button>
                    </Button>
                  </Grid.Col>
                  {/* <ReactAudioPlayer src="/images/Title.mp3" autoPlay loop /> */}
                  <Grid.Col md={6} lg={6}>
                    <Button
                      component={Link}
                      to="/signup"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <button className="btn-2 custom-btn">
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          Click!
                          <Image src="/images/icons.png" width="50px" />
                        </span>
                        <span>Sign Up</span>
                      </button>
                    </Button>
                  </Grid.Col>
                </Grid>
                <Space h="100px" />
              </BackgroundImage>
            </Card>
          </Group>
        </Container>
      </BackgroundImage>
    </div>
  );
}
