import React, { useState, useEffect, useCallback, useRef } from "react";

// Material UI imports
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

// External packages imports
import axios from "axios";
import Draggable from "react-draggable";
import domtoimage from "dom-to-image";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import PulseText from "react-pulse-text";
import Emoji from "react-emoji-render";

// Custom components imports
import AppButtons from "./AppButtons";
import CustomTextField from "./CustomTextField";
import "./styles.css";

const App = () => {
  const { width, height } = useWindowSize();

  const isMobile = useMediaQuery("(max-width:455px)");
  const isTablet = useMediaQuery("(max-width:821px)");

  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState();
  const [, setActiveDrags] = useState(0);
  const [memeText, setMemeText] = useState({
    top: "Your text",
    bottom: "Here",
  });
  const [runConfetti, setRunConfetti] = useState(false);
  const [emoji, setEmoji] = useState(false);

  // useRef can creates a ref attribute that allow us to reference
  // a DOM element and provide us access to its methods.
  // https://medium.com/trabe/react-useref-hook-b6c9d39e2022
  const imageContainerRef = useRef();

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
      setRunConfetti(true);
    });
  };

  const handleImageInputChange = ({ target }) => {
    try {
      const uploadedImageUrl = URL.createObjectURL(target.files[0]);
      setCurrentMeme(uploadedImageUrl);
      target.value = "";
    } catch (e) {
      console.log(e.message);
      alert(
        "There was a problem loading your image, please try again with the correct file format (jpg, jpeg, png only)"
      );
    }
  };

  const dragHandlers = { onStart, onStop };

  const displayEmoji = () => {
    setEmoji(!emoji);
  };

  return (
    <>
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
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="center"
          >
            <PulseText
              text="I Can Has Memes?"
              duration={6000}
              iterationCount={1}
              active={!emoji}
              onEnd={displayEmoji}
            >
              <p className="generatorTitle">I Can Has Memes?</p>
            </PulseText>
            {!emoji && (
              <h1 className="generatorTitle" style={{ visibility: "hidden" }}>
                _
              </h1>
            )}
            {emoji && <Emoji className="generatorTitle" text="😸" />}
          </Box>
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
              <AppButtons
                isMobile={isMobile}
                memeText={memeText}
                onChangePic={handleChangePic}
                onImageInputChange={handleImageInputChange}
                onGenerateMeme={handleGenerateMeme}
                onResetInput={handleResetInput}
              />
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
                style={isTablet ? { width: "100%", maxWidth: "600px" } : {}}
              />
            )}
            {memeText.top && (
              <Draggable bounds="parent" {...dragHandlers}>
                <h2 style={{ position: "absolute", top: "10px" }}>
                  {memeText.top}
                </h2>
              </Draggable>
            )}
            {memeText.bottom && (
              <Draggable bounds="parent" {...dragHandlers}>
                <h2 style={{ position: "absolute", bottom: "10px" }}>
                  {memeText.bottom}
                </h2>
              </Draggable>
            )}
          </Grid>
        </Box>
        {runConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={600}
            onConfettiComplete={() => setRunConfetti(false)}
            run={runConfetti}
          />
        )}
      </Container>
    </>
  );
};

export default App;
