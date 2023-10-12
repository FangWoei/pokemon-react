import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Avatar,
  Container,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearCartItems } from "../api/cart";
import { useNavigate } from "react-router-dom";

export default function Header({ title, page = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();

  return (
    <Container>
      <div className="header">
        <Space h="50px" />
        <Title align="center">Pokemon</Title>
        <Space h="20px" />
        <Group position="apart">
          <Group>
            <Button component={Link} to="/home">
              Home
            </Button>
            <Button component={Link} to="/favorite">
              My Favorite
            </Button>
            <Button component={Link} to="/product">
              Products
            </Button>
            <Button component={Link} to="/cart">
              Cart
            </Button>
            <Button component={Link} to="/order">
              My Orders
            </Button>
            <Button component={Link} to="/post">
              Post
            </Button>
          </Group>
          <Group position="right">
            {cookies && cookies.currentUser ? (
              <>
                <Group>
                  <Avatar
                    src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                    radius="xl"
                  />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
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
        </Group>
        <Space h="20px" />
        <Divider />
      </div>
    </Container>
  );
}
