import { Box, Button } from "@chakra-ui/react";

const Sidebar = ({ activeView, setActiveView }) => {
  
    return (
        <Box
        as="nav"
        w="60"
        bg="gray.100"
        borderRightWidth="1px"
        p="4"
        display="flex"
        flexDirection="column"
      >
        <Button
          mb="4"
          onClick={() => setActiveView("current")}
          colorScheme={activeView === "current" ? "blue" : "gray"}
        >
          Upload Resume
        </Button>
        <Button
          onClick={() => setActiveView("resume")}
          colorScheme={activeView === "resume" ? "blue" : "gray"}
        >
          Resume Data Table
        </Button>
      </Box>
    );
  };

export default Sidebar;