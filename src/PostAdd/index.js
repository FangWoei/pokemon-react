import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
  Textarea,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { createPost, uploadPostImage } from "../api/post";
import { useCookies } from "react-cookie";
import { useMemo } from "react";

function PostAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      notifications.show({
        title: "Post Added",
        color: "green",
      });
      navigate("/post");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
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
  const handleAddNewPost = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        title: title,
        text: text,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadPostImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      setUploading(false);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
  };

  return (
    <>
      {isUser && (
        <Container>
          <Space h="50px" />
          <Title order={2} align="center">
            Add New Post
          </Title>
          <Space h="50px" />
          <Card withBorder shadow="md" p="20px">
            {image && image !== "" ? (
              <>
                <Image src={"http://localhost:1204/" + image} width="100%" />
                <Button color="dark" mt="15px" onClick={() => setImage("")}>
                  Remove Image
                </Button>
              </>
            ) : (
              <Dropzone
                loading={uploading}
                multiple={false}
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) => {
                  handleImageUpload(files);
                }}>
                <Title order={4} align="center" py="20px">
                  Click to upload or Drag image to upload
                </Title>
              </Dropzone>
            )}
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <TextInput
              value={title}
              placeholder="Enter the post title here"
              label="title"
              description="The title of the post"
              withAsterisk
              onChange={(event) => setTitle(event.target.value)}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <Textarea
              value={text}
              size="md"
              label="Text"
              placeholder="Input placeholder"
              onChange={(event) => setText(event.target.value)}
            />

            <Space h="20px" />
            <Button
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
              fullWidth
              onClick={handleAddNewPost}>
              Add New Posts
            </Button>
          </Card>
          <Space h="20px" />
          <Group position="center">
            <Button
              component={Link}
              to="/post"
              variant="subtle"
              size="xs"
              color="gray">
              Go back to post
            </Button>
          </Group>
          <Space h="100px" />
        </Container>
      )}
    </>
  );
}
export default PostAdd;
