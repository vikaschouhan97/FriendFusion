import React from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "../components/FlexBetween";
import UserImage from "../components/UserImage";
import WidgetWrapper from "../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../state";
import { RootState } from "../state/store";
import { SelectChangeEvent } from "@mui/material/Select";
import SnackBarComponent from "../components/Snackbar";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MyPostWidget = ({ picturePath }: any) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [taggedPeople, setTaggedPeople] = useState<any>([]);
  const [successSnackbar, setSuccessSnackbar] = useState<Boolean>(false);
  const [post, setPost] = useState("");
  const { palette }: any = useTheme();
  const { _id, friends }: any = useSelector((state: RootState) => state.user);
  const token: String = useSelector((state: RootState) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    try {
      const formData: any = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      formData.append("taggedPeople", taggedPeople);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", imageUrl);
      }
      if (personName) {
        formData.append("taggedFriends", personName);
      }
      const response = await fetch(`https://friendfusion-api-production.up.railway.app/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");
      setPersonName([]);
      setSuccessSnackbar(true);
      setTimeout(() => {setSuccessSnackbar(false)}, 5000);
    } catch (err) {
      console.log(err);
    }
  };

  // Upload Image to cloudinary
  const handleUploadImage = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("file", data);
      formData.append("upload_preset", "socialMedia");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dga7peviw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const imageData: any = await res.json();
      setImageUrl(imageData?.url);
      return;
    } catch (err) {
      console.log("error", err);
    }
  };

  const names = friends?.map(
    (friend: any) => friend?.firstName + " " + friend?.lastName
  );

  //tag person input
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    setTaggedPeople(value);
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            //   acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
              handleUploadImage(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
          <FormControl sx={{ mt: 2, width: "100%" }}>
            <InputLabel id="demo-multiple-name-label">
              Tag Friends ..
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="tagFriends" />}
              MenuProps={MenuProps}
            >
              {names.map((name: string) => (
                <MenuItem
                  key={name}
                  value={name}
                  // style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", opacity: 0.5 } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem" title="Coming soon">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" title="Coming soon">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" title="Coming soon">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: "#ffffff",
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
       {successSnackbar && <SnackBarComponent description="Post has been added" isOpen={true} type="success" />} 
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
