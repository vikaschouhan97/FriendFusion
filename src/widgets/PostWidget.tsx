import React from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputAdornment,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import Friend from "../components/Friend";
import WidgetWrapper from "../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../state";
import { RootState } from "../state/store";
import SendIcon from "@mui/icons-material/Send";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  taggedPeople
}: any) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState<String>("");
  const dispatch = useDispatch();
  const token: any = useSelector((state: RootState) => state.token);
  const loggedInUserId: any = useSelector((state: RootState) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette }: any = useTheme();
  const main = palette.neutral.main;
  const mediumMain = palette.neutral.mediumMain;
  const primary = palette.primary.main;

  // when user like or remove like from any post
  const patchLike = async () => {
    const response = await fetch(`https://friendfusion-api.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  // when user comment on any post

  const handleAddComment = async () => {
    if (comment) {
      const response = await fetch(`https://friendfusion-api.onrender.com/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment("");
    }
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {taggedPeople[0] && (
        <Typography color={mediumMain} sx={{ mt: "0.5rem" }}>
          - with 
          {taggedPeople.map((person: any) => (
            ` ${person}`
          ))}
          </Typography>
      )}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => {
              setIsComments(!isComments);
              setComment("");
            }}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment: any, i: Number) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
            <InputLabel htmlFor="outlined-adornment-password">
              Add your comment ...
            </InputLabel>
            <FilledInput
              id="filled-adornment-password"
              type="text"
              value={comment}
              sx={{background: palette.background.alt}}
              onChange={(e) => setComment(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleAddComment()}
                    edge="end"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
