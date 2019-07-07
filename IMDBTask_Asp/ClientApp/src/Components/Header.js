import React from "react";
import "../Resources/css/bootstrap.css";
import { Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Logo from "../Resources/Images/logo.png";
import search from "../Resources/Images/search.png";
function Header() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img src={Logo} height="33" width="90" alt="text here" />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/movies">Movies</Nav.Link>
          <Nav.Link href="#features">TV Shows</Nav.Link>
          <Nav.Link href="#pricing">Celebrities</Nav.Link>
          <Nav.Link href="#pricing">WishList</Nav.Link>
        </Nav>
        <Form inline>
          <Button variant="outline-info">
            <img src={search} height="20" width="20" alt="text here" />
          </Button>
          &nbsp;
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
      </Navbar>
    </div>
  );
}

export default Header;
