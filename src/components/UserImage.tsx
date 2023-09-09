import React from "react";
import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }: any) => {
  return (
    <Box
      width={size}
      height={size}
      sx={{ objectFit: "cover", borderRadius: "50%" }}
      component="img"
      alt="user"
      src={`${image}`}
    >
    </Box>
  );
};

export default UserImage;
