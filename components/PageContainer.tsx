import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { mainBG } from "../consts/colour";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      flexDirection="column"
      w="full"
      alignItems="center"
      bg={mainBG}
      minH="100vh"
      h="fit-content"
    >
      {children}
    </Flex>
  );
};

export default PageContainer;
