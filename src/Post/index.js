import {
  Title,
  Grid,
  Card,
  Text,
  Group,
  Space,
  Button,
  LoadingOverlay,
  Image,
  Container,
  BackgroundImage,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fetchPost, deletePost } from "../api/post";
import { useMemo } from "react";

function Posts() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();

  const { isLoading, data: post } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPost(currentUser ? currentUser.token : ""),
  });
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      notifications.show({
        title: "Posts Deleted",
        color: "green",
      });
    },
  });

  const isUser = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "user" ||
        cookies.currentUser.role === "admin")
      ? true
      : false;
  }, [cookies]);
  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  return (
    <>
      {isUser && (
        <BackgroundImage
          src="images/post.webp"
          sx={{
            height: "auto",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}>
          <Container>
            <Group position="center">
              <Image src="images/pokemon.png" width={"300px"} />
            </Group>
            <Group position="apart">
              <h1>Posts</h1>
              <Button
                component={Link}
                to="/post_add"
                variant="gradient"
                gradient={{ from: "black", to: "white", deg: 105 }}>
                Add post
              </Button>
            </Group>
            <Space h="20px" />
            <LoadingOverlay visible={isLoading} />
            <Grid>
              {post
                ? post.map((p) => (
                    <Grid.Col lg={12} key={p.id}>
                      <Card withBorder shadow="sm" p="20px">
                        <Image src={"http://10.1.104.9:1204/" + p.image} />
                        <Title order={5}>Title:{p.title}</Title>
                        <Space h="20px" />
                        <Text>Text:{p.text}</Text>
                        <Space h="20px" />
                        <Group position="center"></Group>
                        <Space h="20px" />
                        {isAdmin && (
                          <Button
                            variant="gradient"
                            gradient={{ from: "orange", to: "red" }}
                            size="xs"
                            radius="50px"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: p._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}>
                            Delete
                          </Button>
                        )}
                      </Card>
                    </Grid.Col>
                  ))
                : null}
            </Grid>
            <Space h="40px" />
          </Container>
        </BackgroundImage>
      )}
    </>
  );
}

export default Posts;
