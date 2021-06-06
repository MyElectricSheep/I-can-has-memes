import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  createMuiTheme,
  fade,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { amber } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Draggable from "react-draggable";
import domtoimage from "dom-to-image";
import CustomTextField from "./CustomTextField";
import "./styles.css";

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  status: {
    danger: "orange",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    // https://stackoverflow.com/questions/60218373/what-the-tag-means-used-in-usestyles-functions
    // every direct descendant element of the class root will have those styles applied to it
    "& > *": {
      margin: theme.spacing(1),
    },
    paddingBottom: "1em",
  },
}));

const App = () => {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState();
  const [, setActiveDrags] = useState(0);
  const [memeText, setMemeText] = useState({
    top: "",
    bottom: "",
  });

  // useRef can creates a ref attribute that allow us to reference
  // a DOM element and provide us access to its methods.
  // https://medium.com/trabe/react-useref-hook-b6c9d39e2022
  let imageContainerRef = useRef();

  const classes = useStyles();

  const getRandom = useCallback(() => {
    return Math.floor(Math.random() * memes.length);
  }, [memes.length]);

  useEffect(() => {
    const getMemes = async () => {
      try {
        // Deep object destructuring
        const {
          data: {
            data: { memes: memesArray },
          },
        } = await axios.get("https://api.imgflip.com/get_memes");

        setMemes(memesArray);
        setCurrentMeme(memesArray[getRandom()].url);

        // without destructuring:
        // const memesData = await axios.get("https://api.imgflip.com/get_memes");
        // setMemes(memesData.data.data.memes)
      } catch (e) {
        console.log(e.message);
      }
    };
    getMemes();
  }, [getRandom]);

  const handleChangePic = () => {
    setCurrentMeme(memes[getRandom()].url);
  };

  const onStart = () => {
    setActiveDrags((prevActiveDrags) => ++prevActiveDrags);
  };

  const onStop = () => {
    setActiveDrags((prevActiveDrags) => --prevActiveDrags);
  };

  const handleUserInput = (e) => {
    setMemeText((prevMemeText) => ({
      ...prevMemeText,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetInput = () => {
    setMemeText({ top: "", bottom: "" });
  };

  const handleGenerateMeme = () => {
    const { current: container } = imageContainerRef;

    container.children[0].classList.remove("currentMemeBorder");

    domtoimage.toJpeg(container, { quality: 0.95 }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "meme.jpeg";
      link.href = dataUrl;
      link.click();
      container.children[0].classList.add("currentMemeBorder");
    });
  };

  const handleImageInputChange = ({ target }) => {
    setCurrentMeme(window.URL.createObjectURL(target.files[0]));
    target.value = "";
  };

  const dragHandlers = { onStart, onStop };

  return (
    <ThemeProvider theme={theme}>
      {currentMeme && (
        <div
          style={{
            backgroundImage: `url("${currentMeme}")`,
          }}
          className="backgroundMeme"
        ></div>
      )}
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <p className="generatorTitle">I Can Has Memes?</p>
          <Grid container spacing={2}>
            <Grid item container xs={12} justify="space-around">
              <CustomTextField
                label="Upper Text"
                name="top"
                value={memeText.top}
                onChange={handleUserInput}
              />
              <CustomTextField
                label="Bottom Text"
                name="bottom"
                value={memeText.bottom}
                onChange={handleUserInput}
              />
            </Grid>
            <Grid item container xs={12} justify="center">
              <ButtonGroup
                className={classes.root}
                disableElevation
                variant="contained"
                size="large"
                color="primary"
                aria-label="contained primary button group"
              >
                <Button onClick={handleChangePic}>Change</Button>
                <Button>
                  <label htmlFor="fileInput">
                    Load Pic
                    <input
                      id="fileInput"
                      name="fileInput"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleImageInputChange}
                      hidden
                    />
                  </label>
                </Button>

                <Button onClick={handleGenerateMeme}>Generate</Button>
                {(memeText.top || memeText.bottom) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className="reset-btn"
                    onClick={handleResetInput}
                  >
                    Reset
                  </Button>
                )}
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid
            ref={imageContainerRef}
            item
            container
            xs={12}
            justify="center"
            style={{
              position: "relative",
            }}
          >
            {currentMeme && (
              <img
                src={currentMeme}
                alt="meme"
                className="currentMeme currentMemeBorder"
              />
            )}
            {memeText.top && (
              <Draggable bounds="parent" {...dragHandlers}>
                <h2>{memeText.top}</h2>
              </Draggable>
            )}
            {memeText.bottom && (
              <Draggable bounds="parent" {...dragHandlers}>
                <h2>{memeText.bottom}</h2>
              </Draggable>
            )}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
