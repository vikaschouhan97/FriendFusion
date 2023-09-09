import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const Index = () => {
  const theme: any = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        p="1rem 6%"
        textAlign="center"
        sx={{
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          FriendFusion
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        sx={{
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <Typography fontWeight="500" variant="h5" sx={{
          mb: "1.5rem", textAlign: "center"
        }}>
          Welcome to FriendFusion, meet new people, make new friends.
        </Typography>
      <Form />
      </Box>
    </Box>
  );
};

export default Index;
