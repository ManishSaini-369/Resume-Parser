import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./sidebar";
import Header from "./header";
import { useState } from "react";


const Dashboard_Layout = ({ children }) => {
    const [activeView, setActiveView] = useState("current");
    return (
        <Flex h="100vh" w="100vw">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <Box flex="1" display="flex" flexDirection="column">
          <Header />
          <Box flex="1" p="10">
            {children(activeView)}
          </Box>
        </Box>
      </Flex>
    )
};

export default Dashboard_Layout;