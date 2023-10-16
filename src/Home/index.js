import {
  Grid,
  Card,
  Group,
  Space,
  Button,
  LoadingOverlay,
  Image,
  Container,
  Modal,
  Text,
  BackgroundImage,
} from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { clearCartItems } from "../api/cart";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchPokemons, deletePokemon } from "../api/pokemon";
import { createFavorite } from "../api/favorite";
import { Chart } from "react-google-charts";

export default function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [setCookies, removeCookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [type, setType] = useState("");
  const [currentPokemon, setCurrentPokemon] = useState([]);
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedFavourite, setSelectedFavourite] = useState(null);
  const { isLoading, data: pokemons } = useQuery({
    queryKey: ["pokemons", type],
    queryFn: () => fetchPokemons(currentUser ? currentUser.token : ""),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const isUser = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "user" ||
        cookies.currentUser.role === "admin")
      ? true
      : false;
  }, [cookies]);
  useEffect(() => {
    let newList = pokemons ? [...pokemons] : [];
    if (type !== "") {
      newList = newList.filter((p) => p.type === type);
    }
    const total = Math.ceil(newList.length / perPage);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "ip":
        newList = newList.sort((a, b) => {
          return a.ip - b.ip;
        });
        break;
    }

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);
    setCurrentPokemon(newList);
  }, [pokemons, type, sort, perPage, currentPage]);

  const typeOptions = useMemo(() => {
    let options = [];
    if (pokemons && pokemons.length > 0) {
      pokemons.forEach((poke) => {
        if (!options.includes(poke.type)) {
          options.push(poke.type);
        }
      });
    }
    return options;
  }, [pokemons]);

  const deleteMutation = useMutation({
    mutationFn: deletePokemon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pokemons"],
      });
      notifications.show({
        title: "Pokemons Deleted",
        color: "green",
      });
      close();
    },
  });

  const createFavoriteMutation = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite"],
      });
      notifications.show({
        title: "Pokemon Added to Favorite",
        color: "green",
      });
    },
  });

  const handleFavoriteClick = (poke) => {
    createFavoriteMutation.mutate({
      data: JSON.stringify({
        pokemon: poke._id,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };
  return (
    <>
      {isUser && (
        <BackgroundImage
          src="images/star.avif"
          sx={{
            height: "auto",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}>
          <Space h={"40px"} />
          <Group position="right" mr={"30px"}>
            {cookies && cookies.currentUser ? (
              <>
                <Image src="/images/logout.jpg" width={"50px"} radius="xl" />
                <Group>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" color="white" fw={500}>
                      {cookies.currentUser.name}
                    </Text>

                    <Text c="dimmed" size="xs">
                      {cookies.currentUser.email}
                    </Text>
                  </div>
                </Group>
                <Button
                  variant={"light"}
                  onClick={() => {
                    removeCookies("currentUser");
                    clearCartItems();
                    navigate("/");
                  }}>
                  Logout
                </Button>
              </>
            ) : null}
          </Group>
          <Container>
            <Group position="center">
              <Image src="images/pokemon.png" width={"300px"} />
            </Group>
            <Group position="right">
              {isAdmin && (
                <Button
                  sx={{
                    height: "50px",
                    display: "flex",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                  }}
                  component={Link}
                  to="/poke_add">
                  Add
                  <Image src="/images/icons.png" width="50px" />
                </Button>
              )}
            </Group>
            <Space h="20px" />
            <Group>
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setCurrentPage(1);
                }}>
                <option value="">All Type</option>
                {typeOptions.map((type) => {
                  return (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  );
                })}
              </select>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                }}>
                <option value="">No Sorting</option>
                <option value="name">Sort By Name</option>
                <option value="ip">Sort By IP</option>
              </select>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(parseInt(event.target.value));
                  setCurrentPage(1);
                }}>
                <option value="6">6 Per Page</option>
                <option value="10">10 Per Page</option>
                <option value={9999999}>All</option>
              </select>
            </Group>
            <Space h="20px" />
            <LoadingOverlay visible={isLoading} />
            <Grid>
              {currentPokemon
                ? currentPokemon.map((poke) => {
                    return (
                      <Grid.Col sm={12} md={6} lg={4} key={poke._id}>
                        <Card withBorder shadow="sm" radius="lg">
                          <Card.Section>
                            <BackgroundImage src="/images/card.png">
                              <Image
                                src={"http://10.1.104.9:1204/" + poke.image}
                              />
                            </BackgroundImage>
                          </Card.Section>
                          <Space h={"30px"} />
                          <Group position="right">
                            <AiFillHeart
                              style={{ color: "red", fontSize: "30px" }}
                              onClick={() => handleFavoriteClick(poke)}
                            />
                          </Group>
                          <Group position="center">
                            <h3 style={{ color: "grey" }}>{poke.ip}</h3>
                          </Group>
                          <Group position="center">
                            <h2>{poke.name}</h2>
                          </Group>
                          <Group position="center"></Group>
                          <Space h="20px" />
                          <Button
                            color={
                              poke.type === "Normal"
                                ? "grey"
                                : poke.type === "Fire"
                                ? "red"
                                : poke.type === "Water"
                                ? "blue"
                                : poke.type === "Grass"
                                ? "green"
                                : poke.type === "Flying"
                                ? "indigo"
                                : poke.type === "Fighting"
                                ? "pink"
                                : poke.type === "Poison"
                                ? "grape"
                                : poke.type === "Electric"
                                ? "yellow"
                                : poke.type === "Ground"
                                ? "orange"
                                : poke.type === "Rock"
                                ? "grey"
                                : poke.type === "Psychic"
                                ? "pink"
                                : poke.type === "Ice"
                                ? "cyan"
                                : poke.type === "Bug"
                                ? "lime"
                                : poke.type === "Ghost"
                                ? "indigo"
                                : poke.type === "Steel"
                                ? "lime"
                                : poke.type === "Dragon"
                                ? "cyan"
                                : poke.type === "Dark"
                                ? "dark"
                                : poke.type === "Fairy"
                                ? "pink"
                                : "defaultColor"
                            }
                            fullWidth
                            onClick={() => {
                              open();
                              setSelectedFavourite(poke);
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
                                poke.type === "Normal"
                                  ? "/images/normal.png"
                                  : poke.type === "Fire"
                                  ? "/images/fire.png"
                                  : poke.type === "Water"
                                  ? "/images/water.png"
                                  : poke.type === "Grass"
                                  ? "/images/grass.png"
                                  : poke.type === "Flying"
                                  ? "/images/flying.png"
                                  : poke.type === "Fighting"
                                  ? "/images/fighting.png"
                                  : poke.type === "Poison"
                                  ? "/images/poison.png"
                                  : poke.type === "Electric"
                                  ? "/images/electric.png"
                                  : poke.type === "Ground"
                                  ? "/images/ground.png"
                                  : poke.type === "Rock"
                                  ? "/images/rock.png"
                                  : poke.type === "Psychic"
                                  ? "/images/psychic.png"
                                  : poke.type === "Ice"
                                  ? "/images/ice.png"
                                  : poke.type === "Bug"
                                  ? "/images/bug.png"
                                  : poke.type === "Ghost"
                                  ? "/images/ghost.png"
                                  : poke.type === "Steel"
                                  ? "/images/steel.png"
                                  : poke.type === "Dragon"
                                  ? "/images/dragon.png"
                                  : poke.type === "Dark"
                                  ? "/images/dark.png"
                                  : poke.type === "Fairy"
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
                            selectedFavourite.type === "Normal"
                              ? "/images/normal.png"
                              : selectedFavourite.type === "Fire"
                              ? "/images/fire.png"
                              : selectedFavourite.type === "Water"
                              ? "/images/water.png"
                              : selectedFavourite.type === "Grass"
                              ? "/images/grass.png"
                              : selectedFavourite.type === "Flying"
                              ? "/images/flying.png"
                              : selectedFavourite.type === "Fighting"
                              ? "/images/fighting.png"
                              : selectedFavourite.type === "Poison"
                              ? "/images/poison.png"
                              : selectedFavourite.type === "Electric"
                              ? "/images/electric.png"
                              : selectedFavourite.type === "Ground"
                              ? "/images/ground.png"
                              : selectedFavourite.type === "Rock"
                              ? "/images/rock.png"
                              : selectedFavourite.type === "Psychic"
                              ? "/images/psychic.png"
                              : selectedFavourite.type === "Ice"
                              ? "/images/ice.png"
                              : selectedFavourite.type === "Bug"
                              ? "/images/bug.png"
                              : selectedFavourite.type === "Ghost"
                              ? "/images/ghost.png"
                              : selectedFavourite.type === "Steel"
                              ? "/images/steel.png"
                              : selectedFavourite.type === "Dragon"
                              ? "/images/dragon.png"
                              : selectedFavourite.type === "Dark"
                              ? "/images/dark.png"
                              : selectedFavourite.type === "Fairy"
                              ? "/images/fairy.png"
                              : ""
                          }
                        />
                        <Image
                          src={
                            "http://10.1.104.9:1204/" + selectedFavourite.image
                          }
                        />
                      </Group>
                      <div style={{ textAlign: "center" }}>
                        <h1 style={{ color: "white" }}>
                          Name: {selectedFavourite.name}
                        </h1>
                        <h3 style={{ color: "white" }}>
                          Ip: {selectedFavourite.ip}
                        </h3>
                      </div>
                      <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={[
                          ["Stat", "Value"],
                          ["Hp", selectedFavourite.hp],
                          ["Attack", selectedFavourite.attack],
                          ["Defense", selectedFavourite.defense],
                          ["Speed", selectedFavourite.speed],
                        ]}
                        options={{
                          title: "Pokemon Data",
                          pieHole: 0.4,
                          is3D: false,
                        }}
                      />
                      <Space h={"50px"} />
                      {isAdmin && (
                        <Group position="apart">
                          <Button
                            component={Link}
                            to={"/poke/" + selectedFavourite._id}
                            variant="gradient"
                            gradient={{ from: "blue", to: "darkblue" }}
                            size="md"
                            radius="lg">
                            Edit
                          </Button>
                          <Button
                            variant="gradient"
                            gradient={{ from: "red", to: "red" }}
                            size="md"
                            radius="lg"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: selectedFavourite._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}>
                            Delete
                          </Button>
                        </Group>
                      )}
                    </>
                  ) : null}
                  <Space h={"50px"} />
                </Container>
              </BackgroundImage>
            </Modal>

            <Space h="40px" />
            <div>
              <span
                style={{
                  marginRight: "10px",
                }}>
                Page {currentPage} of {totalPages.length}
              </span>
              {totalPages.map((page) => {
                return (
                  <button
                    style={{ color: "black", width: "10px" }}
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                    }}>
                    {page}
                  </button>
                );
              })}
            </div>
            <Space h="40px" />
          </Container>
        </BackgroundImage>
      )}
    </>
  );
}
