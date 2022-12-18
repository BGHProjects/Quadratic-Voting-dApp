import { Flex, Text, chakra, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { Web3Context } from "../contexts/Web3Context";

const NavBar = () => {
  const { account, connect } = useContext(Web3Context);

  return (
    <Container>
      <ConnectButton onClick={() => connect()}>
        <Text fontFamily="styledFont" color="white" fontSize="20px" isTruncated>
          {account ? account : "Connect"}{" "}
        </Text>
      </ConnectButton>
    </Container>
  );
};

const ConnectButton = chakra(Button, {
  baseStyle: {
    borderRadius: "10px",
    bg: "dodgerblue",
    p: "10px",
    colorScheme: "blackAlpha",
    maxWidth: "150px",
  },
});

const Container = chakra(Flex, {
  baseStyle: {
    w: "full",
    h: "70px",
    as: "nav",
    bg: "orange",
    p: "10px",
    alignItems: "center",
  },
});

export default NavBar;
