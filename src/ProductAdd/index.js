import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { addProduct, uploadProductImage } from "../api/products";
import { useCookies } from "react-cookie";

function ProductsAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      notifications.show({
        title: "Product Added",
        color: "green",
      });
      navigate("/product");
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
  const handleAddNewPro = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        description: description,
        price: price,
        category: category,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadProductImage,
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
            Add New Products
          </Title>
          <Space h="50px" />
          <Card withBorder shadow="md" p="20px">
            <TextInput
              value={name}
              placeholder="Enter the products name here"
              label="Name"
              description="The name of the products"
              withAsterisk
              onChange={(event) => setName(event.target.value)}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <TextInput
              value={description}
              placeholder="Enter the products description here"
              label="description"
              description="The description of the products"
              withAsterisk
              onChange={(event) => setDescription(event.target.value)}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <NumberInput
              value={price}
              placeholder="Enter the price here"
              label="Price"
              description="The price of the products"
              withAsterisk
              onChange={setPrice}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
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
              value={category}
              placeholder="Enter the category here"
              label="Category"
              description="The category of the products"
              withAsterisk
              onChange={(event) => setCategory(event.target.value)}
            />
            <Space h="20px" />
            <Button
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
              fullWidth
              onClick={handleAddNewPro}>
              Add New Products
            </Button>
          </Card>
          <Space h="20px" />
          <Group position="center">
            <Button
              component={Link}
              to="/product"
              variant="subtle"
              size="xs"
              color="gray">
              Go back to Products
            </Button>
          </Group>
          <Space h="100px" />
        </Container>
      )}
    </>
  );
}
export default ProductsAdd;
