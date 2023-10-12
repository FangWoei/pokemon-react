import {
  Title,
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchPokemons, deletePokemon } from "../api/pokemon";
import { createFavorite, getFavorite } from "../api/favorite";

export default function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
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
        if (!options.includes(poke.category)) {
          options.push(poke.category);
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
      <Container>
        <Header />
        <Group position="apart">
          <Title order={3} align="center">
            Pokemon
          </Title>
          {isAdmin && (
            <Button
              component={Link}
              to="/poke_add"
              variant="gradient"
              gradient={{ from: "black", to: "White", deg: 105 }}>
              Add New
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
            <option value="">All Categories</option>
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
                    <Card withBorder shadow="sm" p="20px">
                      <Image src={"http://localhost:1204/" + poke.image} />
                      <Title order={5}>{poke.ip}</Title>
                      <Title order={5}>{poke.name}</Title>
                      <Group position="center">
                        <Button
                          fullWidth
                          variant="gradient"
                          gradient={{ from: "blue", to: "black" }}
                          onClick={() => handleFavoriteClick(poke)}>
                          {" "}
                          Favorite
                        </Button>
                      </Group>
                      <Space h="20px" />
                      <Button
                        onClick={() => {
                          open();
                          setSelectedFavourite(poke);
                        }}>
                        Open Modal
                      </Button>
                    </Card>
                  </Grid.Col>
                );
              })
            : null}
        </Grid>
        <Modal
          opened={opened}
          onClose={() => {
            close();
            setSelectedFavourite(null);
          }}
          withCloseButton={false}
          size="100%">
          {selectedFavourite ? (
            <>
              <Group position="apart">
                <Group>
                  <Image
                    src={"http://localhost:1204/" + selectedFavourite.image}
                  />
                </Group>
                <Group>
                  <Title order={5}>{selectedFavourite.name}</Title>
                  <Text>{selectedFavourite.ip}</Text>
                  <Text>{selectedFavourite.type}</Text>
                  <Text>{selectedFavourite.hp}</Text>
                  <Text>{selectedFavourite.attack}</Text>
                  <Text>{selectedFavourite.defense}</Text>
                  <Text>{selectedFavourite.speed}</Text>
                </Group>
              </Group>
              {isAdmin && (
                <Group position="apart">
                  <Button
                    component={Link}
                    to={"/poke/" + selectedFavourite._id}
                    variant="gradient"
                    gradient={{ from: "blue", to: "darkblue" }}
                    size="xs"
                    radius="50px">
                    Edit
                  </Button>
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
                </Group>
              )}
            </>
          ) : null}
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
    </>
  );
}
