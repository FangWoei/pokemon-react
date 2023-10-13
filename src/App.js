import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import PokeAdd from "./PokeAdd";
import PokeEdit from "./PokeEdit";
import Front from "./Front";
import Login from "./Login";
import Signup from "./Signup";
import ProductsAdd from "./ProductAdd";
import ProductsEdit from "./ProductEdit";
import Cart from "./Cart";
import Order from "./Orders";
import Checkout from "./Checkout";
import PaymentVerification from "./PaymentVerification";
import Products from "./Products";
import Favorite from "./Favorite";
import Posts from "./Post";
import PostAdd from "./PostAdd";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/home" element={<Home />} />
        <Route path="/poke/:id" element={<PokeEdit />} />
        <Route path="/poke_add" element={<PokeAdd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product_add" element={<ProductsAdd />} />
        <Route path="/products/:id" element={<ProductsEdit />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-payment" element={<PaymentVerification />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/post" element={<Posts />} />
        <Route path="/post_add" element={<PostAdd />} />
      </Routes>
    </Router>
  );
}

export default App;
