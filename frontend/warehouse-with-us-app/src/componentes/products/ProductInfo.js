import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundcolor: 'green'
  },
  table: {
      border:'none'
  }
}));

export default function Productinfo(props) {
  const classes = useStyles();

//   console.log(props.product.quantity);

    return (
        <div>
            {props.isLoaded ? (
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Informacje o produkcie
                        </Typography>
                        <TableContainer component={Paper} item xs={12}>
                        <Table aria-label="products table" className={classes.table}>
                        <TableBody>
                            <TableRow key={1} className="tr-link">
                                <TableCell>
                                <Typography>
                                    Producent: {props.product.manufacturer}
                                </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow key={2} className="tr-link">
                                <TableCell>
                                <Typography>
                                    Model: {props.product.model}
                                </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow key={3} className="tr-link">
                                <TableCell>
                                <Typography>
                                    Cena: {props.product.price}
                                </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow key={4} className="tr-link">
                                <TableCell>
                                <Typography>
                                    Ilość: {props.product.quantity}
                                </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow key={5} className="tr-link">
                                <TableCell>
                                <Typography>
                                    Kategoria: 
                                    {props.categories.find(element => element.id === props.product.category) === undefined ? (
                                        " -"
                                    ) : (
                                        " " + props.categories.find(element => element.id === props.product.category).name
                                    )}
                                </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                        </TableContainer>
                        {/* <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Typography>
                                    Producent: {props.product.manufacturer}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    Model: {props.product.model}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    Cena: {props.product.price}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    Ilość: {props.product.quantity}
                                </Typography>
                            </Grid>
                        </Grid> */}
                    </div>
                </Container>
            ) : (
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Ładowanie...
                        </Typography>
                        </div>
                </Container>
            )}
        </div>
    );
}