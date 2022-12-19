import {
  Flex,
  HStack,
  Image,
  VStack,
  Button,
  Text,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { gradBG } from "../consts/colour";
import { VotingItem } from "../consts/types";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Web3Context } from "../contexts/Web3Context";
import { useContext, useState } from "react";

const Item = (item?: VotingItem) => {
  const toast = useToast();

  const {
    account,
    positiveVote,
    negativeVote,
    claim,
    currentWeight,
    calcCost,
  } = useContext(Web3Context);

  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0);

  const handleCost = async () => {
    if (weight === 0) {
      setCost(0);
    } else {
      const isPositive = weight > 0;
      const currWeight = await currentWeight(item?.id as number, isPositive);
      const newCost = await calcCost(currWeight, Math.abs(weight));
      setCost(newCost);
    }
  };

  const handleUpVote = () => {
    setWeight(weight + 1);
    handleCost();
  };

  const handleDownVote = () => {
    setWeight(weight - 1);
    handleCost();
  };

  const claimGwei = async () => {
    try {
      await claim(item?.id as number);
      toast({
        title: "Successful Claim",
        description: "You have upvoted on this item",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log("Error while claiming gwei ", err);
      toast({
        title: "Error claiming Gwei",
        description:
          "There was an unexpected error while you were trying to claim the gwei. Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const submitVote = async () => {
    if (weight >= 0) {
      try {
        await positiveVote(item?.id as number, weight, cost);
        toast({
          title: "Successful Upvote",
          description: "You have upvoted on this item",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        console.log("Error upvoting ", err);
        toast({
          title: "Error during Upvote",
          description:
            "There was an unexpected error while upvoting. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else if (weight < 0) {
      try {
        await negativeVote(item?.id as number, weight, cost);
        toast({
          title: "Successful Downvote",
          description: "You have downvoted on this item",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        console.log("Error downvoting ", err);
        toast({
          title: "Error during Downvote",
          description:
            "There was an unexpected error while downvoting. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container>
      <HStack w="full" justifyContent="space-between">
        <HStack spacing={5}>
          <ItemImage
            src="https://source.unsplash.com/random/900×700/?fruit"
            //   src={`https://ipfs.io/ipfs/${item?.imageHash}`}
          />
          {account !== item?.owner && (
            <>
              <VStack>
                <VoteButton bg="limegreen" onClick={() => handleUpVote()}>
                  <ArrowUpIcon boxSize={7} color="white" />
                </VoteButton>
                <AppText>{item?.positiveWeight}</AppText>
              </VStack>
              <VStack>
                <VoteButton bg="red" onClick={() => handleDownVote()}>
                  <ArrowDownIcon boxSize={7} color="white" />
                </VoteButton>
                <AppText>{item?.negativeWeight}</AppText>
              </VStack>
            </>
          )}
          <VStack alignItems="flex-start">
            <AppText fontWeight="bold" fontSize="20px">
              {item?.title}
            </AppText>
            <AppText>{item?.description}</AppText>
          </VStack>
        </HStack>

        {account === item?.owner ? (
          <VStack>
            <AppText>Amount: {item?.amount / 1_000_000_000} gwei</AppText>

            <Button
              bg="orange"
              colorScheme="blackAlpha"
              onClick={() => claimGwei()}
            >
              <AppText>Claim</AppText>
            </Button>
          </VStack>
        ) : (
          <VStack>
            <AppText>Weight: {weight}</AppText>
            <AppText>Cost: {cost / 1_000_000_000} gwei</AppText>

            <Button
              bg="orange"
              colorScheme="blackAlpha"
              onClick={() => submitVote()}
            >
              <AppText>Submit Vote</AppText>
            </Button>
          </VStack>
        )}
      </HStack>
    </Container>
  );
};

const VoteButton = chakra(Button, {
  baseStyle: {
    border: "1px solid white",
    colorScheme: "blackAlpha",
    w: "50px",
    h: "50px",
  },
});

const ItemImage = chakra(Image, {
  baseStyle: {
    h: "90px",
    w: "90px",
    alt: "image",
    borderRadius: "10px",
  },
});

const Container = chakra(Flex, {
  baseStyle: {
    maxW: "1000px",
    w: "80%",
    h: "150px",
    borderRadius: "10px",
    bgGradient: gradBG,
    p: "20px",
  },
});

const AppText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "styledFont",
  },
});

export default Item;
