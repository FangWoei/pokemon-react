import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchFavorite, deleteFavorite } from "../api/favorite";
import {
  Container,
  Card,
  Grid,
  Image,
  Button,
  Group,
  Space,
  BackgroundImage,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { useMemo } from "react";

export default function Favorite() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [selectedFavourite, setSelectedFavourite] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading, data: favorite = [] } = useQuery({
    queryKey: ["favorite"],
    queryFn: () => fetchFavorite(currentUser ? currentUser.token : ""),
  });

  const isUser = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "user" ||
        cookies.currentUser.role === "admin")
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite"],
      });
      notifications.show({
        title: "Favorite Deleted",
        color: "green",
      });
      // close the modal
      close();
    },
  });
  return (
    <>
      {isUser && (
        <BackgroundImage
          src="images/favorite.avif"
          sx={{
            height: "auto",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}>
          <Container>
            <Group position="apart">
              <h1 style={{ color: "white" }}>Favorite</h1>
            </Group>
            <Space h="20px" />
            <LoadingOverlay visible={isLoading} />

            <Grid>
              {favorite
                ? favorite.map((f) => {
                    return (
                      <Grid.Col sm={12} md={6} lg={4} key={f._id}>
                        <Card withBorder shadow="sm" radius="lg">
                          <Card.Section>
                            <Image
                              src={"http://localhost:1204/" + f.pokemon.image}
                            />
                          </Card.Section>
                          <Group position="center">
                            <h3 style={{ color: "grey" }}>{f.pokemon.ip}</h3>
                          </Group>
                          <Group position="center">
                            <h2>{f.pokemon.name}</h2>
                          </Group>
                          <Group position="center"></Group>
                          <Space h="20px" />
                          <Button
                            color={
                              f.pokemon.type === "Normal"
                                ? "grey"
                                : f.pokemon.type === "Fire"
                                ? "red"
                                : f.pokemon.type === "Water"
                                ? "blue"
                                : f.pokemon.type === "Grass"
                                ? "green"
                                : f.pokemon.type === "Flying"
                                ? "indigo"
                                : f.pokemon.type === "Fighting"
                                ? "pink"
                                : f.pokemon.type === "Poison"
                                ? "grape"
                                : f.pokemon.type === "Electric"
                                ? "yellow"
                                : f.pokemon.type === "Ground"
                                ? "orange"
                                : f.pokemon.type === "Rock"
                                ? "grey"
                                : f.pokemon.type === "Psychic"
                                ? "pink"
                                : f.pokemon.type === "Ice"
                                ? "cyan"
                                : f.pokemon.type === "Bug"
                                ? "lime"
                                : f.pokemon.type === "Ghost"
                                ? "indigo"
                                : f.pokemon.type === "Steel"
                                ? "lime"
                                : f.pokemon.type === "Dragon"
                                ? "cyan"
                                : f.pokemon.type === "Dark"
                                ? "dark"
                                : f.pokemon.type === "Fairy"
                                ? "pink"
                                : "defaultColor"
                            }
                            fullWidth
                            onClick={() => {
                              open();
                              setSelectedFavourite(f);
                            }}
                            style={{ display: "flex" }}>
                            <Space w={"50px"} />
                            See More
                            <Space w={"50px"} />
                            <Image
                              style={{
                                width: "30px",
                              }}
                              src={
                                f.pokemon.type === "Normal"
                                  ? "/images/normal.png"
                                  : f.pokemon.type === "Fire"
                                  ? "/images/fire.png"
                                  : f.pokemon.type === "Water"
                                  ? "/images/water.png"
                                  : f.pokemon.type === "Grass"
                                  ? "/images/grass.png"
                                  : f.pokemon.type === "Flying"
                                  ? "/images/flying.png"
                                  : f.pokemon.type === "Fighting"
                                  ? "/images/fighting.png"
                                  : f.pokemon.type === "Poison"
                                  ? "/images/poison.png"
                                  : f.pokemon.type === "Electric"
                                  ? "/images/electric.png"
                                  : f.pokemon.type === "Ground"
                                  ? "/images/ground.png"
                                  : f.pokemon.type === "Rock"
                                  ? "/images/rock.png"
                                  : f.pokemon.type === "Psychic"
                                  ? "/images/psychic.png"
                                  : f.pokemon.type === "Ice"
                                  ? "/images/ice.png"
                                  : f.pokemon.type === "Bug"
                                  ? "/images/bug.png"
                                  : f.pokemon.type === "Ghost"
                                  ? "/images/ghost.png"
                                  : f.pokemon.type === "Steel"
                                  ? "/images/steel.png"
                                  : f.pokemon.type === "Dragon"
                                  ? "/images/dragon.png"
                                  : f.pokemon.type === "Dark"
                                  ? "/images/dark.png"
                                  : f.pokemon.type === "Fairy"
                                  ? "/images/fairy.png"
                                  : ""
                              }
                            />
                          </Button>
                        </Card>
                      </Grid.Col>
                    );
                  })
                : null}
            </Grid>
            <Modal
              padding={"0"}
              opened={opened}
              onClose={() => {
                close();
                setSelectedFavourite(null);
              }}
              withCloseButton={false}
              size="60%">
              <BackgroundImage
                src="/images/modal.jpg"
                sx={{
                  backgroundSize: "cover",
                  backgroundAttachment: "fixed",
                  backgroundPosition: "center",
                }}>
                <Container w={"50%"}>
                  {selectedFavourite ? (
                    <>
                      <Space h={"50px"} />

                      <Group position="center">
                        <Image
                          width={"100px"}
                          src={
                            selectedFavourite.pokemon.type === "Normal"
                              ? "/images/normal.png"
                              : selectedFavourite.pokemon.type === "Fire"
                              ? "/images/fire.png"
                              : selectedFavourite.pokemon.type === "Water"
                              ? "/images/water.png"
                              : selectedFavourite.pokemon.type === "Grass"
                              ? "/images/grass.png"
                              : selectedFavourite.pokemon.type === "Flying"
                              ? "/images/flying.png"
                              : selectedFavourite.pokemon.type === "Fighting"
                              ? "/images/fighting.png"
                              : selectedFavourite.pokemon.type === "Poison"
                              ? "/images/poison.png"
                              : selectedFavourite.pokemon.type === "Electric"
                              ? "/images/electric.png"
                              : selectedFavourite.pokemon.type === "Ground"
                              ? "/images/ground.png"
                              : selectedFavourite.pokemon.type === "Rock"
                              ? "/images/rock.png"
                              : selectedFavourite.pokemon.type === "Psychic"
                              ? "/images/psychic.png"
                              : selectedFavourite.pokemon.type === "Ice"
                              ? "/images/ice.png"
                              : selectedFavourite.pokemon.type === "Bug"
                              ? "/images/bug.png"
                              : selectedFavourite.pokemon.type === "Ghost"
                              ? "/images/ghost.png"
                              : selectedFavourite.pokemon.type === "Steel"
                              ? "/images/steel.png"
                              : selectedFavourite.pokemon.type === "Dragon"
                              ? "/images/dragon.png"
                              : selectedFavourite.pokemon.type === "Dark"
                              ? "/images/dark.png"
                              : selectedFavourite.pokemon.type === "Fairy"
                              ? "/images/fairy.png"
                              : ""
                          }
                        />
                        <Image
                          src={
                            "http://localhost:1204/" +
                            selectedFavourite.pokemon.image
                          }
                        />
                      </Group>
                      <div style={{ textAlign: "center" }}>
                        <h1 style={{ color: "white" }}>
                          Name: {selectedFavourite.pokemon.name}
                        </h1>
                        <h3 style={{ color: "white" }}>
                          Ip: {selectedFavourite.pokemon.ip}
                        </h3>
                      </div>
                      <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={[
                          ["Stat", "Value"],
                          ["Hp", selectedFavourite.pokemon.hp],
                          ["Attack", selectedFavourite.pokemon.attack],
                          ["Defense", selectedFavourite.pokemon.defense],
                          ["Speed", selectedFavourite.pokemon.speed],
                        ]}
                        options={{
                          title: "Pokemon Data",
                          pieHole: 0.4,
                          is3D: false,
                        }}
                      />
                      <Space h={"50px"} />
                      <Button
                        variant="gradient"
                        gradient={{ from: "orange", to: "red" }}
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate({
                            id: selectedFavourite._id,
                            token: currentUser ? currentUser.token : "",
                          });
                        }}>
                        Delete
                      </Button>
                    </>
                  ) : null}
                  <Space h={"50px"} />
                </Container>
              </BackgroundImage>
            </Modal>
            <Space h="40px" />
            <Group position="center">
              <Button component={Link} to="/home">
                Continue
              </Button>
            </Group>
          </Container>
        </BackgroundImage>
      )}
    </>
  );
}
