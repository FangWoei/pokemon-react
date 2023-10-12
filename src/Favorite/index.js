import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchFavorite, deleteFavorite } from "../api/favorite";
import {
  Container,
  Title,
  Card,
  Grid,
  Image,
  Button,
  Group,
  Space,
  Text,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

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
      <Container>
        <Header />
        <Group position="apart">
          <Title order={3} align="center">
            Favorite
          </Title>
        </Group>
        <Space h="20px" />
        <LoadingOverlay visible={isLoading} />
        <Grid>
          {favorite
            ? favorite.map((f) => {
                return (
                  <Grid.Col sm={12} md={6} lg={4} key={f._id}>
                    <Card withBorder shadow="sm" p="20px">
                      <Image src={"http://localhost:1204/" + f.pokemon.image} />
                      <Title order={5}>{f.pokemon.ip}</Title>
                      <Title order={5}>{f.pokemon.name}</Title>
                      <Space h="20px" />
                      <Button
                        onClick={() => {
                          open();
                          setSelectedFavourite(f);
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
                    src={
                      "http://localhost:1204/" + selectedFavourite.pokemon.image
                    }
                  />
                </Group>
                <Group>
                  <Title order={5}>{selectedFavourite.pokemon.name}</Title>
                  <Text>{selectedFavourite.pokemon.ip}</Text>
                  <Text>{selectedFavourite.pokemon.type}</Text>
                  <Text>{selectedFavourite.pokemon.hp}</Text>
                  <Text>{selectedFavourite.pokemon.attack}</Text>
                  <Text>{selectedFavourite.pokemon.defense}</Text>
                  <Text>{selectedFavourite.pokemon.speed}</Text>
                </Group>
              </Group>

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
        </Modal>
        <Space h="40px" />
        <Group position="center">
          <Button component={Link} to="/home">
            Continue
          </Button>
        </Group>
      </Container>
    </>
  );
}
