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
  Select,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { addPokemons, uploadPokemonImage } from "../api/pokemon";
import { useCookies } from "react-cookie";
import { useMemo } from "react";

function PokeAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [type, setType] = useState("");
  const [hp, setHp] = useState("");
  const [attack, setAttack] = useState("");
  const [defense, setDefense] = useState("");
  const [speed, setSpeed] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addPokemons,
    onSuccess: () => {
      notifications.show({
        title: "Pokemon Added",
        color: "green",
      });
      navigate("/home");
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
  const handleAddNewPoke = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        ip: ip,
        type: type,
        hp: hp,
        attack: attack,
        defense: defense,
        speed: speed,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadPokemonImage,
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
            Add New Pokemon
          </Title>
          <Space h="50px" />
          <Card withBorder shadow="md" p="20px">
            <TextInput
              value={name}
              placeholder="Enter the pokemon name here"
              label="Name"
              description="The name of the pokemon"
              withAsterisk
              onChange={(event) => setName(event.target.value)}
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
            <NumberInput
              value={ip}
              placeholder="Enter the IP here"
              label="IP"
              description="The IP of the pokemon"
              withAsterisk
              onChange={setIp}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <NumberInput
              value={hp}
              placeholder="Enter the hp here"
              label="hp"
              description="The hp of the pokemon"
              withAsterisk
              onChange={setHp}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <Select
              value={type}
              label="type"
              placeholder="Enter the type here"
              description="The type of the pokemon"
              data={[
                "Normal",
                "Fire",
                "Water",
                "Grass",
                "Flying",
                "Fighting",
                "Poison",
                "Electric",
                "Ground",
                "Rock",
                "Psychic",
                "Ice",
                "Bug",
                "Ghost",
                "Steel",
                "Dragon",
                "Dark",
                "Fairy",
              ]}
              onChange={setType}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <NumberInput
              value={attack}
              placeholder="Enter the attack here"
              label="attack"
              description="The attack of the pokemon"
              withAsterisk
              onChange={setAttack}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <NumberInput
              value={defense}
              placeholder="Enter the defense here"
              label="defense"
              description="The defense of the pokemon"
              withAsterisk
              onChange={setDefense}
            />
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <NumberInput
              value={speed}
              placeholder="Enter the speed here"
              label="speed"
              description="The speed of the pokemon"
              withAsterisk
              onChange={setSpeed}
            />
            <Space h="20px" />
            <Button
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
              fullWidth
              onClick={handleAddNewPoke}>
              Add New Pokemon
            </Button>
          </Card>
          <Space h="20px" />
          <Group position="center">
            <Button
              component={Link}
              to="/home"
              variant="subtle"
              size="xs"
              color="gray">
              Go back to Pokemon
            </Button>
          </Group>
          <Space h="100px" />
        </Container>
      )}
    </>
  );
}
export default PokeAdd;
