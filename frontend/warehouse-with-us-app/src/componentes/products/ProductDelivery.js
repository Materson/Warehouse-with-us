import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import ProductInfo from './ProductInfo';
import {deviceID} from '../deviceID';
import {DBconfig} from '../../DBconfig';
import {quantitySum} from './utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundcolor: 'green'
  },
}));

export default function ProductDelivery(props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [notNumericError, setNotNumericError] = useState(false);

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseInt(str)); // ...and ensure strings of whitespace fail
  }

  function validateQuantity(qInput) {
    if(qInput && isNumeric(qInput) && parseInt(qInput) > 0) {
      setNotNumericError(false);
      const newQuantity = parseInt(qInput);
      if(props.product.quantity - newQuantity >= 0) {
        setError(false);
        return true;
      } else {
        setError(true);
        return false;
      }
    }
    else
    {
      setError(false);
      setNotNumericError(true);
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const qInput = event.target.elements.quantity.value;
    console.log(qInput);
    const id = props.product.id;
    console.log(isNumeric(qInput));
    if(validateQuantity(qInput)) {
      const quantity = parseInt(qInput);
      const devid = deviceID();
      const request = indexedDB.open(DBconfig.name, DBconfig.version);
      request.onsuccess = function(event) {
        const db = event.target.result;
        const reqGet = db.transaction("products").objectStore("products").get(id);
        reqGet.onsuccess = function(event) {
          const data = event.target.result;
          const index = data.quantity.findIndex(element => element.devid === devid);
          if(index !== -1)
          {
            data.quantity[index].delta -= quantity;
          }
          else
          {
            data.quantity.push({
              devid: devid,
              delta: -quantity
            });
          }
          db.transaction("products", "readwrite").objectStore("products").put(data);
          // register operation
          const reqGetParam = db.transaction("operations").objectStore("operations").get(data.id);
          reqGetParam.onsuccess = function (event) {
            const operation = event.target.result;
            operation.moved = 1;
            db.transaction("operations", "readwrite").objectStore("operations").put(operation);
          }
          const sum = quantitySum(data.quantity);
          props.changeData({
            id: data.id,
            manufacturer: data.manufacturer,
            model: data.model,
            price: data.price,
            quantity: sum
          });
        }
      }
      props.changeFunction(ProductInfo);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Ile towaru wydano?
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="quantity"
                variant="outlined"
                required
                fullWidth
                id="quantity"
                label="Ilość"
                autoFocus
                onChange={(e) => {
                  validateQuantity(e.target.value);
                }}
                {...(error ? 
                  {error: true, helperText: "Próba wydania za dużo towaru"} : (
                    notNumericError ?
                    {error: true, helperText: "Podaj dodatnią liczbę"} : ({})))}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Zapisz
          </Button>
        </form>
      </div>
    </Container>
  );
}