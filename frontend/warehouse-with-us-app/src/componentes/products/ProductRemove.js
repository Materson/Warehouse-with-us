import React from 'react';
import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ProductInfo from './ProductInfo';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';

import {DBconfig} from '../../DBconfig'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttons: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundcolor: 'green'
    },
  }));

function ProductRemove(props) {
    const classes = useStyles();

    function handleClick(event) {
        event.preventDefault();
        const id = props.product.id;
        const request = indexedDB.open(DBconfig.name, DBconfig.version);
        request.onsuccess = function(event) {
            const db = event.target.result;
            db.transaction("products", "readwrite").objectStore("products").delete(id);
            // register operation
            const reqGetParam = db.transaction("operations").objectStore("operations").get(id);
            reqGetParam.onsuccess = function (event) {
                const operation = event.target.result;
                operation.deleted = 1;
                operation.added = 0;
                operation.moved = 0;
                operation.edited = 0;
                db.transaction("operations", "readwrite").objectStore("operations").put(operation);
            }
        }
        props.history.push("/");
        // const params = {
        //     id: id
        // }
        // // const result = props.handleAPI('/product/delete', 'DELETE', params);
        // const HOST = window.location.hostname;
        // const init = {
        //   method: "DELETE",
        //   mode: 'cors',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Accept':'*/*',
        //     'Authorization': 'Bearer ' + localStorage.getItem("token")
        //   },
        //   body: JSON.stringify(params)
        // }
        // fetch("https://"+HOST+":8002/product/delete", init)
        // .then(res => res.json())
        // .then(
        //   (result) => {
        //     props.history.push("/");
        //   },
        //   (error) => {
        //       console.log("blad");
        //       console.log(error);
        //   }
        // )
      }

        return(
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Grid
                        container
                    >
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                Jesteś pewien, że chcesz usunąć ten produkt?
                            </Typography>
                        </Grid>
                        <Grid container
                            justify="center"
                            alignItems="flex-end"
                            spacing={4}
                            className={classes.buttons}
                        >
                            <Grid item xs={6} align="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleClick}
                                >
                                    Tak
                                </Button>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Button
                                    variant="contained"
                                    color="default"
                                    onClick={() => props.changeFunction(ProductInfo)}
                                >
                                    Nie
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        );
}

export default withRouter(ProductRemove);