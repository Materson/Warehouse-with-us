import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [emailError, setEmailError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);


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
    if(props.online)
    {
      if(!email) setEmailError(true);
      if(email && password && validateEmail(email)) {
        const params = {
          email: email,
          password: password
        }
          const init = {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Accept':'*/*'
              },
              body: JSON.stringify(params)
          }
          
          console.log("Dane do wyslania");
          console.log(params);
          const HOST = window.location.hostname;
          fetch("https://"+HOST+":8002/auth/token", init)
          .then(res => res.json())
          .then(
              (result) => {
                console.log("W signin");
                console.log(result);
                console.log(result.access_token);
                if(result.access_token !== undefined) {
                  props.login(result.access_token);
                }
                else
                {
                  setLoginError(true);
                }
              },
              (error) => {
                  console.log("blad");
                  console.log(error);
              }
            )
      }
      else
      {
        setLoginError(true);
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Zaloguj się
        </Typography>
        <form className={classes.form} noValidate onSubmit={(event) => handleSubmit(event)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            {...(emailError ? {error: true, helperText: "Podaj poprawny adres e-mail"} : {})}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Hasło"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError ? (
            <Typography color="error">Niepoprawny login lub hasło</Typography>
          ) : null}

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
            Zaloguj się
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/register">
                {"Nie masz konta? Zarejestruj się"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}