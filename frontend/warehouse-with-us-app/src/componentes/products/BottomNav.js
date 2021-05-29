import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import InputIcon from '@material-ui/icons/Input';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ProductSupply from './ProductSupply';
import ProductDelivery from './ProductDelivery';
import ProductEdit from './ProductEdit';
import ProductRemove from './ProductRemove';
// import {Grid} from '@material-ui/core';
import "./BottomNav.css";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
  button: {
    "max-width": "100%",
  }
});

export default function BottomNav(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(5);
  const [role, setRole] = React.useState("");

  useEffect(() => {
    // const init = {
    //   method: "GET",
    //   mode: 'cors',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept':'*/*',
    //     'Authorization': 'Bearer ' + localStorage.getItem("token")
    //   },
    // }
    // const HOST = window.location.hostname;
    // fetch("https://"+HOST+":8002/user",init)
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       setRole(result.role);
    //       // console.log("Odpowiedz na usera");
    //       // console.log(result);
    //     },
    //     // Note: it's important to handle errors here
    //     // instead of a catch() block so that we don't swallow
    //     // exceptions from actual bugs in components.
    //     (error) => {
    //       console.log("error")
    //     }
    //   )
    if(localStorage.getItem("manager") !== null)
      setRole(localStorage.getItem("manager"));
  }, [])

  return (
      <div className="fixed-bottom">
        
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
              setValue(newValue);
              // console.log(value);
          }}
          showLabels
          // className={classes.root}
        >
            {/* <BottomNavigationAction component={Link} to={'/product/'+props.id+'/supply'} size="small" label="Dostawa fix" icon={<InputIcon />} />
            <BottomNavigationAction component={Link} to={'/product/'+props.id+'/deliver'} size="small" label="Wydanie" icon={<LocalShippingIcon />} />
            <BottomNavigationAction component={Link} to={'/product/'+props.id+'/edit'} size="small" label="Edytuj" icon={<EditIcon />} />
            <BottomNavigationAction component={Link} to={'/product/'+props.id+'/remove'} size="small" label="Usuń" icon={<DeleteIcon />} /> */}
          {/* <Grid container
            onChange={(event, newValue) => {
              setValue(newValue);
              console.log("Container"+value);
            }}
            justify="center"
             alignItems="flex-end"
          > */}
            {/* <Grid item xs={role === "manager" ? 3 : 4} className="center-icon"> */}
                <BottomNavigationAction className={classes.button} onClick={() => props.changeFunction(ProductSupply)} label="Dostawa" icon={<InputIcon />} />
              {/* </Grid>
              <Grid item xs={role === "manager" ? 3 : 4} className="center-icon"> */}
                <BottomNavigationAction className={classes.button} onClick={() => props.changeFunction(ProductDelivery)} size="small" label="Wydanie" icon={<LocalShippingIcon />} />
              {/* </Grid>
              <Grid item xs={role === "manager" ? 3 : 4} className="center-icon"> */}
                <BottomNavigationAction className={classes.button} onClick={() => props.changeFunction(ProductEdit)} size="small" label="Edytuj" icon={<EditIcon />} />
              {/* </Grid> */}
            {role ?(
              // <Grid item xs={3} className="center-icon">
                <BottomNavigationAction  className={classes.button} onClick={() => props.changeFunction(ProductRemove)} size="small" label="Usuń" icon={<DeleteIcon />} />
              // </Grid>
            ) : ""}
          {/* </Grid> */}
        </BottomNavigation>
        {/* <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
            position="static"
        >
            <BottomNavigationAction size="small" label="Dostawa static" icon={<InputIcon />} />
            <BottomNavigationAction size="small" label="Wydanie" icon={<LocalShippingIcon />} />
            <BottomNavigationAction size="small" label="Edytuj" icon={<EditIcon />} />
            <BottomNavigationAction size="small" label="Usuń" icon={<DeleteIcon />} />
        </BottomNavigation> */}
      </div>
  );
}
