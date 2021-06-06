import { fade, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useInputStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #e2e2e1",
    width: "220px",
    borderColor: theme.palette.secondary.main,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&$focused": {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
}));

const useLabelStyles = makeStyles(() => ({
  root: {},
}));

const CustomTextField = (props) => {
  const inputClasses = useInputStyles();
  const labelClasses = useLabelStyles();

  return (
    <TextField
      size="medium"
      InputProps={{
        classes: inputClasses,
        disableUnderline: true,
        style: { paddingLeft: "10px" },
      }}
      InputLabelProps={{
        classes: labelClasses,
        style: {
          color: "black",
          opacity: "0.8em",
          zIndex: 1,
          paddingLeft: "10px",
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;
