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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useCookies } from "react-cookie";
import { fetchPost, deletePost } from "../api/post";

function Posts() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();

  const { isLoading, data: post } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPost(currentUser ? currentUser.token : ""),
  });
  console.log(fetchPost);

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

  return (
    <>
      <Container>
        <Header />
        <Group position="apart">
          <Title order={3} align="center">
            Posts
          </Title>
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
                <Grid.Col sm={12} md={6} lg={4} key={p._id}>
                  <Card withBorder shadow="sm" p="20px">
                    <Image src={"http://localhost:1204/" + p.image} />
                    <Title order={5}>{p.title}</Title>
                    <Space h="20px" />
                    <Text>{p.text}</Text>
                    <Space h="20px" />
                    <Group position="center"></Group>
                    <Space h="20px" />
                    <Button
                      variant="gradient"
                      gradient={{ from: "orange", to: "red" }}
                      size="xs"
                      radius="50px"
                      onClick={() => {
                        deleteMutation.mutate({
                          id: p._id,
                        });
                      }}>
                      Delete
                    </Button>
                  </Card>
                </Grid.Col>
              ))
            : null}
        </Grid>
        <Space h="40px" />
      </Container>
    </>
  );
}

export default Posts;
