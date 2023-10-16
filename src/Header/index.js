import { useState } from "react";
import { FaBars, FaShoppingBag } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { BsFillFilePostFill } from "react-icons/bs";
import { GiSelfLove } from "react-icons/gi";
import { MdOutlineCatchingPokemon } from "react-icons/md";
import { SiPokemon } from "react-icons/si";
import { CiViewList } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import "./header.css";


const Sidebar = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/home",
      name: "Pokemon",
      icon: <MdOutlineCatchingPokemon />,
    },
    {
      path: "/favorite",
      name: "Favorite",
      icon: <GiSelfLove />,
    },
    {
      path: "/product",
      name: "Product",
      icon: <FaShoppingBag />,
    },
    {
      path: "/cart",
      name: "Cart",
      icon: <FaMoneyBill />,
    },
    {
      path: "/order",
      name: "Orders",
      icon: <CiViewList />,
    },
    {
      path: "/post",
      name: "Post",
      icon: <BsFillFilePostFill />,
    },
  ];
  return (
    <div className="container">
      <div
        style={{
          width: isOpen ? "200px" : "50px",
        }}
        className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            <SiPokemon />
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassName="active">
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text">
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
