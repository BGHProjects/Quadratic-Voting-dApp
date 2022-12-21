import { Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Item from "../components/Item";
import { VotingItem } from "../consts/types";
import { Web3Context } from "../contexts/Web3Context";

export default function Home() {
  const { rankedItems } = useContext(Web3Context);
  const [allItems, setAllItems] = useState<any>([]);

  useEffect(() => {
    const handleRankedItems = async () => {
      setAllItems(await rankedItems());
    };

    handleRankedItems();
  }, [rankedItems]);

  return (
    <VStack spacing={10} mt="100px" w="full">
      <Text fontFamily="styledFont" color="white" fontSize="30px">
        Ranked List
      </Text>
      {allItems.map((item: VotingItem) => (
        <Item key={JSON.stringify(item)} item={item} />
      ))}
    </VStack>
  );
}
