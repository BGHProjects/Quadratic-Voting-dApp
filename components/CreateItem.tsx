import {
  Button,
  chakra,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { SetStateAction, useState } from "react";
import { gradBG } from "../consts/colour";
import { Web3Context } from "../contexts/Web3Context";

const CreateItem = () => {
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const toast = useToast();

  const { createItem, handleIPFSUpload } = useContext(Web3Context);

  const handleCreateItem = async () => {
    try {
      if (!title || !image || !description) {
        console.log("title", title);
        console.log("image", image);
        console.log("description", description);

        toast({
          title: "Invalid Form Data",
          description:
            "Please fill out all of the fields in the form to create an item",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const imageHash = await handleIPFSUpload(image);

      await createItem(title, imageHash, description);

      toast({
        title: "Created Item",
        description: "Successfully created a new item",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log("Error creating item ", err);
      toast({
        title: "Error creating item",
        description:
          "There was an error creating an item. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ContentContainer spacing={5}>
      <Text fontFamily="styledFont" color="white" fontSize="24px">
        Create Item
      </Text>
      <VStack spacing={2} w="full">
        <FormLabel>Title</FormLabel>
        <StyledInput
          placeholder="Enter Title here"
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setTitle(e.target.value)
          }
        />
      </VStack>
      <VStack spacing={2} w="full">
        <FormLabel>Image</FormLabel>
        <StyledInput
          type="file"
          onChange={(e: { target: { files: SetStateAction<any> } }) =>
            setImage(e.target.files[0])
          }
        />
      </VStack>
      <VStack spacing={2} w="full">
        <FormLabel>Description</FormLabel>
        <StyledTextArea
          placeholder="Enter Description here"
          h="100px"
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setDescription(e.target.value)
          }
        />
      </VStack>
      <Button
        bg="orange"
        colorScheme="blackAlpha"
        onClick={() => handleCreateItem()}
      >
        <Text fontSize="20px" fontFamily="styledFont" color="white">
          Submit
        </Text>
      </Button>
    </ContentContainer>
  );
};

const StyledTextArea = chakra(Textarea, {
  baseStyle: {
    color: "white",
    bg: "transparent",
    w: "80%",
    _placeholder: { color: "lightgrey", fontFamily: "styledFont" },
    borderWidth: 3,
    fontFamily: "styledFont",
  },
});

const StyledInput = chakra(Input, {
  baseStyle: {
    color: "white",
    bg: "transparent",
    w: "80%",
    _placeholder: { color: "lightgrey", fontFamily: "styledFont" },
    borderWidth: 3,
    fontFamily: "styledFont",
  },
});

const FormLabel = chakra(Text, {
  baseStyle: {
    fontFamily: "styledFont",
    color: "white",
    alignSelf: "flex-start",
    ml: "80px",
    fontSize: "20px",
  },
});

const ContentContainer = chakra(VStack, {
  baseStyle: {
    w: "800px",
    h: "fit-content",
    minH: "600px",
    borderRadius: "10px",
    bgGradient: gradBG,
    alignItems: "center",
    p: "20px",
    mt: "50px",
  },
});

export default CreateItem;
