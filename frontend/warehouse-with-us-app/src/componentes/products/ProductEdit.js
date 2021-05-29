import React, {useState, useEffect} from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';

import ProductInfo from './ProductInfo';
import {DBconfig} from '../../DBconfig';
import {quantitySum, validatePrice, toFloat} from './utils';
import {compareCategories} from '../category/utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    '& .MuiSelect-select': {
      margin: theme.spacing(1),
      width: '25ch',
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundcolor: 'green'
  },
}));

export default function ProductEdit(props) {
  const classes = useStyles();
  const [priceError, setPriceError] = useState(false);
  const [manufacturerError, setManufacturerError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [category, setCategory] = useState("");
  const [num, setNum] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    const manufacturer = event.target.elements.manufacturer.value;
    const model = event.target.elements.model.value;
    const prInput = event.target.elements.price.value;
    if(!prInput) setPriceError(true);
    if(!manufacturer) setManufacturerError(true);
    if(!model) setModelError(true);
    const id = props.product.id;

    if(prInput && manufacturer && model && !priceError) {
      const price = toFloat(prInput);
      // if(price > 0) {
       
      const request = indexedDB.open(DBconfig.name, DBconfig.version);
      request.onsuccess = function(event) {
        const db = event.target.result;
        const categ = props.categories.find(element => element.name === category);
        const reqGet = db.transaction("products").objectStore("products").get(id);
        reqGet.onsuccess = function(event) {
          const data = event.target.result;
          data.manufacturer = manufacturer;
          data.model = model;
          data.price = price;
          data.category = categ.id;

          db.transaction("products", "readwrite").objectStore("products").put(data);
          // register operation
          const reqGetParam = db.transaction("operations").objectStore("operations").get(data.id);
          reqGetParam.onsuccess = function (event) {
            const operation = event.target.result;
            operation.edited = 1;
            db.transaction("operations", "readwrite").objectStore("operations").put(operation);
          }
          const sum = quantitySum(data.quantity);
          props.changeData({
            id: data.id,
            manufacturer: data.manufacturer,
            model: data.model,
            price: data.price,
            quantity: sum,
            category: categ.id
          });
        }
      }
      props.changeFunction(ProductInfo);
    }
  }

  useEffect(() => {
    const findCategory = props.categories.find(element => element.id === props.product.category);
    if(findCategory === undefined)
    {
      setCategory("-");
    }
    else 
    {
      setCategory(findCategory.name);
    }
  },[]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Edytuj produkt
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="manufacturer"
                name="manufacturer"
                variant="outlined"
                required
                fullWidth
                id="manufacturer"
                label="Producent"
                autoFocus
                defaultValue={props.product.manufacturer}
                onChange={(e) => {
                  e.target.value ? setManufacturerError(false) : setManufacturerError(true)
                }}
                {...(manufacturerError ? {error: true, helperText: "Podaj Producenta"} : {})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="model"
                label="Model"
                name="model"
                autoComplete="model"
                defaultValue={props.product.model}
                onChange={(e) => {
                  e.target.value ? setModelError(false) : setModelError(true)
                }}
                {...(modelError ? {error: true, helperText: "Podaj model"} : {})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="price"
                label="Cena"
                name="price"
                autoComplete="price"
                defaultValue={props.product.price}
                onChange={(e) => {
                  validatePrice(e.target.value, setPriceError);
                }}
                {...(priceError ? {error: true, helperText: "Nieprawidłowa cena"} : {})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="select-category"
                select
                label="Wybierz kategorię"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {props.categories.sort(compareCategories).map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>

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