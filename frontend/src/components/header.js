import { Box, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";

const Header = () => {
    const { user, logoutUser } = useAuth();
  
    const handleLogout = async () => {
      await logoutUser();
    };
  
    return (
      <Flex
        as="header"
        align="center"
        justify="space-between"
        w="full"
        px="4"
        bg="white"
        borderBottomWidth="1px"
        h="14"
      >
        <Text fontSize="lg">Welcome {user ? user.username : "Guest"} 👋</Text>
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          Logout
        </Button>
      </Flex>
    );
  };

  export default Header;