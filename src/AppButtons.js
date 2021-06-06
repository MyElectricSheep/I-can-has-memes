import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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

const AppButtons = ({
  isMobile,
  memeText,
  onChangePic,
  onImageInputChange,
  onGenerateMeme,
  onResetInput,
}) => {
  const classes = useStyles();
  return (
    <ButtonGroup
      orientation={isMobile ? "vertical" : "horizontal"}
      className={classes.root}
      disableElevation
      variant="contained"
      size="large"
      color="primary"
      aria-label="contained primary button group"
    >
      <Button onClick={onChangePic}>Change</Button>
      <Button>
        <label htmlFor="fileInput">
          Load Pic
          <input
            id="fileInput"
            name="fileInput"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={onImageInputChange}
            hidden
          />
        </label>
      </Button>

      <Button onClick={onGenerateMeme}>Generate</Button>
      {(memeText.top || memeText.bottom) && (
        <Button
          variant="contained"
          color="secondary"
          className="reset-btn"
          onClick={onResetInput}
        >
          Reset
        </Button>
      )}
    </ButtonGroup>
  );
};

export default AppButtons;
