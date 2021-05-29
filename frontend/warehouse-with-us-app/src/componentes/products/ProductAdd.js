import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';

import { DBconfig } from '../../DBconfig';
import {validatePrice, toFloat} from './utils';
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
  }
}));

function ProductAdd(props) {
  const classes = useStyles();
  const [priceError, setPriceError] = useState(false);
  const [manufacturerError, setManufacturerError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [category, setCategory] = useState("-");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const request = indexedDB.open(DBconfig.name, DBconfig.version);
    let offlineDB = [];
    request.onsuccess = function(event) {
        const db = event.target.result;
        const reqGet = db.transaction("categories").objectStore("categories").getAll();
        reqGet.onsuccess = function(event) {
            event.target.result.map((row) => {
                offlineDB.push({...row});
            });
            setCategories(offlineDB);
        }
    }
  },[]);

  function handleSubmit(event) {
    event.preventDefault();
    const manufacturer = event.target.elements.manufacturer.value;
    const model = event.target.elements.model.value;
    const prInput = event.target.elements.price.value;
    if(!prInput) setPriceError(true);
    if(!manufacturer) setManufacturerError(true);
    if(!model) setModelError(true);
    // if(priceError || manufacturerError || modelError) return 1;

    if(prInput && manufacturer && model && !priceError) {
      const price = toFloat(prInput);
      const categ = categories.find(element => element.name === category);

      const params = {
        manufacturer: manufacturer,
        model: model,
        price: price,
        quantity: [],
        category: categ.id
      }
      const request = indexedDB.open(DBconfig.name, DBconfig.version);
      request.onsuccess = function(event) {
        const db = event.target.result;
        const reqAdd = db.transaction("products","readwrite").objectStore("products").add(params);
        reqAdd.onsuccess = function (event) {
          const id = event.target.result;
          //new id to String
          const reqDel = db.transaction("products","readwrite").objectStore("products").delete(id);
          reqDel.onsuccess = function(event) {
            const newparams = {
              id: id.toString(),
              manufacturer: manufacturer,
              model: model,
              price: price,
              quantity: [],
              category: categ.id
            }
            const newreqAdd = db.transaction("products","readwrite").objectStore("products").add(newparams);
            newreqAdd.onsuccess = function (event) {
              // register operation
              const operation = {
                id: id.toString(),
                added: 1,
                edited: 0,
                moved: 0,
                deleted: 0
              }
              db.transaction("operations","readwrite").objectStore("operations").add(operation);             
              props.history.push("/");
            }
          }
        }
      }
      // const init = {
      //     method: 'POST',
      //     mode: 'cors',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Accept':'*/*',
      //       'Authorization': 'Bearer ' + localStorage.getItem("token")
      //     },
      //     body: JSON.stringify(params)
      // }
      // console.log("Dane do wyslania");
      // console.log(params);
      // const HOST = window.location.hostname;
      // fetch("https://"+HOST+":8002/product", init)
      // .then(res => res.json())
      // .then(
      //     (result) => {
      //       console.log("W add");
      //       console.log(result);
      //       props.history.push("/");
      //     },
      //     (error) => {
      //         console.log("blad");
      //         console.log(error);
      //     }
      // )
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Dodaj produkt
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
                {categories.sort(compareCategories).map((option) => (
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
            Dodaj
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(ProductAdd)