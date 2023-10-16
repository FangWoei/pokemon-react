import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getCartItems,
  removeItemFromCart,
  removeItemsFromCart,
} from "../api/cart";
import {
  Container,
  Title,
  Table,
  Image,
  Box,
  Button,
  Checkbox,
  Group,
  Space,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Cart() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const queryClient = useQueryClient();
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const isUser = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "user" ||
        cookies.currentUser.role === "admin")
      ? true
      : false;
  }, [cookies]);
  /* check box*/
  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };
  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
      if (newCheckedList.length === 0) {
        setCheckAll(false);
      }
    }
  };

  const deleteCheckedItems = () => {
    deleteProductsMutation.mutate(checkedList);
  };

  const deleteProductsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Selected Products Deleted",
        color: "green",
      });
      // to reset the checkbox

      setCheckAll(false);
      setCheckedList([]);
    },
  });

  /* check box*/

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    console.log(total);
    return total;
  }, [cart]);

  // console.log(queryClient.getQueryData(["cart"]));
  // console.log(getCartItems());
  // console.log(cart);

  const deleteMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Deleted",
        color: "green",
      });
    },
  });

  const rows = cart.map((c) => (
    <tr key={c.name}>
      <td>
        <Checkbox
          checked={checkedList && checkedList.includes(c._id) ? true : false}
          type="checkbox"
          onChange={(event) => {
            checkboxOne(event, c._id);
          }}
        />
      </td>
      <td width="20%">
        <Image src={"http://10.1.104.9:1204/" + c.image} width="200px" />
      </td>
      <td>{c.name}</td>
      <td>${c.price}</td>
      <td>{c.quantity}</td>
      <td>${c.price}</td>

      <td>
        <Box w={140}>
          <Button
            fullWidth
            variant="outline"
            color="red"
            onClick={(event) => {
              event.preventDefault();
              deleteMutation.mutate(c);
            }}>
            Remove
          </Button>
        </Box>
      </td>
    </tr>
  ));
  return (
    <>
      {isUser && (
        <Container>
          <Title order={3} align="center">
            Cart
          </Title>
          <Table>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    type="checkbox"
                    checked={checkAll}
                    disabled={cart && cart.length > 0 ? false : true}
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Product</th>
                <th></th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>${cartTotal}</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <Divider />
          <Space h="20px" />
          <Group position="apart">
            <Button
              disabled={checkedList.length === 0}
              variant="outline"
              color="red"
              onClick={(event) => {
                event.preventDefault();
                deleteCheckedItems();
              }}>
              Delete Selected
            </Button>
            <Button
              component={Link}
              to="/checkout"
              disabled={cart.length > 0 ? false : true}>
              Checkout
            </Button>
          </Group>
        </Container>
      )}
    </>
  );
}
