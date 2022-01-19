import { Navbar } from "react-bootstrap";

const Header = ({ ...props }) => {
  return (
    <Navbar bg="dark" variant="dark" {...props}>
      <Navbar.Brand>stitcher</Navbar.Brand>
    </Navbar>
  );
};

export default Header;
