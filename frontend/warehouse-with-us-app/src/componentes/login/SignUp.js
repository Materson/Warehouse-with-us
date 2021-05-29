import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {Select, FormControl, InputLabel} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp(props) {
  const classes = useStyles();
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [roleError, setRoleError] = useState(false);

  function validateEmail(newEmail) {
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (newEmail && pattern.test(newEmail)) {
      setEmailError(false);
      return true;
    } else {
      setEmailError(true);
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const firstName = event.target.elements.firstName.value;
    const lastName = event.target.elements.lastName.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const role = event.target.elements.role.value;
    if(!firstName) setFirstNameError(true);
    if(!lastName) setLastNameError(true);
    if(!email) setEmailError(true);
    if(!password) setPasswordError(true);
    if(!role) setRoleError(true);

    if(props.online && firstName && lastName && validateEmail(email) && password && role) {
      const params = {
        // firstName: firstName,
        // lastName: lastName,
        email: email,
        password: password,
        role: role
      }
  
      // const result = props.handleAPI('/auth/register', 'POST', params);
      const init = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept':'*/*'
        },
        body: JSON.stringify(params)
      }
      const HOST = window.location.hostname;
      fetch("https://"+HOST+":8002/auth/register", init)
      .then(res => res.json())
      .then(
          (result) => {
            console.log("W register");
            console.log(result);
            props.history.push("/");
          },
          (error) => {
              console.log("blad");
              console.log(error);
          }
        )
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Zarejestruj się
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Imię"
                autoFocus
                onChange={(e) => {
                  e.target.value ? setFirstNameError(false) : setFirstNameError(true)
                }}
                {...(firstNameError ? {error: true, helperText: "Podaj Imię"} : {})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Nazwisko"
                name="lastName"
                autoComplete="lname"
                onChange={(e) => {
                  e.target.value ? setLastNameError(false) : setLastNameError(true)
                }}
                {...(lastNameError ? {error: true, helperText: "Podaj Nazwisko"} : {})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                onChange={(e) => {
                  validateEmail(e.target.value);
                }}
                {...(emailError ? {error: true, helperText: "Podaj poprawny adres e-mail"} : {})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  e.target.value ? setPasswordError(false) : setPasswordError(true)
                }}
                {...(passwordError ? {error: true, helperText: "Podaj hasło"} : {})}
              />
            </Grid>
            <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="role-native-simple">Rola</InputLabel>
                    <Select
                        native
                        // value={state.age}
                        // onChange={handleChange}
                        inputProps={{
                            name: 'role',
                            id: 'role-native-simple',
                        }}
                        onChange={(e) => {
                          e.target.value ? setRoleError(false) : setRoleError(true)
                        }}
                        {...(roleError ? {error: true, helperText: "Podaj rolę"} : {})}
                    >
                    <option aria-label="Rola" value="" />
                    <option value={'manager'}>Menadżer</option>
                    <option value={'employee'}>Pracownik</option>
                    </Select>
                </FormControl>
            </Grid>
          </Grid>

          {!props.online ? (
            <Typography color="error">Brak połączenia z Internetem</Typography>
          ) : null}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Zarejestruj sie
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/">
                {"Zaloguj się"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(SignUp);