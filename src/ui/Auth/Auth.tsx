import React, { useState } from "react";
import { Redirect } from "react-router";
import { UserName } from "../../domain/user";
import { useAuthenticate } from "../../application/authenticate";
import style from "./Auth.module.css";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export function Auth() {
  const [name, setName] = useState<UserName>("");
  const [email, setEmail] = useState<Email>("");
  const [loading, setLoading] = useState(false);

  const { user, authenticate } = useAuthenticate();

  const [values, setValues] = useState<State>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div>
      <Grid>
        <Paper className={style.paper}>
          <h6 className={style.title}>ACCESS</h6>
          <Grid container>
            <Paper className={style.paperEntry}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid xs={12}>
                  <h6 className={style.welcome}>WELCOME</h6>
                </Grid>
                <Grid xs={12}>
                  <div className={style.containerInputs}>
                    <FormControl sx={{ m: 1, width: "90%" }} variant="outlined">
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        className={style.inputColor}
                      >
                        Email
                      </InputLabel>
                      <OutlinedInput
                        className={style.inputStyle}
                        id="outlined-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        label="Password"
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: "90%" }} variant="outlined">
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        className={style.inputColor}
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        className={style.inputStyle}
                        id="outlined-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showPassword ? (
                                <VisibilityOff style={{ color: "#46484B" }} />
                              ) : (
                                <Visibility style={{ color: "#46484B" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                  </div>
                  <div style={{ marginTop: "-2.7em", marginLeft: "0.7em" }}>
                    <Grid container spacing={3}>
                      <Grid xs>
                        <Grid container spacing={2}>
                          <Grid xs>
                            <Checkbox className={style.check} {...label} />
                          </Grid>
                          <Grid xs={8}>
                            <h1 className={style.h1}>Remember me</h1>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid xs={7}>
                        <h1 className={style.h1Rigth}>Forgot Passwword?</h1>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid xs={12}>
                  <Button variant="contained" className={style.button}>
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}
