import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SyncIcon from '@material-ui/icons/Sync';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from 'react-router-dom';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import CategoryIcon from '@material-ui/icons/Category';

import './HeadBar.css';
import {DBconfig} from '../../DBconfig';
import {deviceID} from '../deviceID';
import {quantitySum} from '../products/utils';
import {syncCategories} from '../../services/category';

// const useStyles = ({
//   root: {
//     flexGrow: 1,
//   },
//   // menuButton: {
//   //   marginRight: theme.spacing(2),
//   // },
//   title: {
//     flexGrow: 1,
//   },
// });

// function removeItemOnce(arr, value) {
//   var index = arr.indexOf(value);
//   if (index > -1) {
//     arr.splice(index, 1);
//   }
//   return arr;
// }


class MenuAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorE: false,
      sync: false
    }
  }

  // classes = useStyles();

  // handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  delSync(operationDel, db) {
    return new Promise(resolve => {
      if(operationDel.length > 0)
      {
        const init = {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify(operationDel)
        }
        console.log("Produkty w init: ");
        console.log(operationDel);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/product/delete", init)
        .then(res =>
          {
            if(res.ok)
              return res.json();
            else
              throw new Error("Something wrong");
          })
        .then(
            (result) => {
              console.log("wszedl fetch");
              console.log(result);
              Promise.all(result.map((element, index) => {
                console.log(element);
                console.log(operationDel[index].id);
                console.log("wszedl del1");
                const reqDelOp = db.transaction("operations","readwrite").objectStore("operations").delete(operationDel[index].id);
                // resolve(true);
                // reqDelOp.onsuccess = function (event) {
                //   // console.log(productAdd);
                //   // removeItemOnce(productAdd,productDel[index]);
                //   // console.log(productAdd);
                //   // console.log("wszedl del2");
                //   // operationAdd[index].id = element.id;
                //   // operationAdd[index].added = 0;
                //   // const reqAdd = db.transaction("products", "readwrite").objectStore("products").add(element);
                //   // reqAdd.onsuccess = function(event) {
                //   //   db.transaction("operations","readwrite").objectStore("operations").add(operationAdd[index]);
                //   // }
                // }
              }));
              resolve(true);
            },
            (error) => {
                console.log("blad delete");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
          )
      }
      else resolve(true);
    });
  }

  addSync(productAdd, operationAdd, db) {
    return new Promise ( resolve => {
      if(productAdd.length > 0)
      {
        const init = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify(productAdd)
        }
        console.log("Produkty w init: ");
        console.log(productAdd);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/product", init)
        .then(res =>
          {
            if(res.ok)
              return res.json();
            else
              throw new Error("Something wrong");
          })
        .then(
            (result) => {
              console.log("wszedl fetch");
              console.log(result);
              let categoryConflicts = [];
              Promise.all(result.map((response, index) => {
                let element = null;
                if("message" in response)
                {
                  element = response.product;
                  categoryConflicts.push(element);
                }
                else
                {
                  element = response;
                }
                const reqDel = db.transaction("products", "readwrite").objectStore("products").delete(operationAdd[index].id);
                reqDel.onsuccess = function(event) {
                  console.log("wszedl del1");
                  const reqDelOp = db.transaction("operations","readwrite").objectStore("operations").delete(operationAdd[index].id);
                  reqDelOp.onsuccess = async function (event) {
                    console.log("wszedl del2");
                    const newProd = {...productAdd[index], category:element.category, id:element.id}
                    await new Promise( res => {
                      const reqAdd = db.transaction("products", "readwrite").objectStore("products").add(newProd);
                      reqAdd.onsuccess = function(event) {
                        operationAdd[index].id = element.id;
                        operationAdd[index].added = 0;
                        operationAdd[index].moved = 0;
                        operationAdd[index].edited = 0;
                        db.transaction("operations","readwrite").objectStore("operations").add(operationAdd[index]);
                        res(true);
                      }
                    });
                  }
                }
              }));
              resolve(true);
              if(categoryConflicts.length > 0)
                localStorage.setItem("categoryConflicts", JSON.stringify(categoryConflicts));
            },
            (error) => {
                console.log("blad add");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
          )
      }
      else resolve(true);
    });
  }

  editSync(productEdit, operationEdit, db) {
    return new Promise(resolve => {
      if(productEdit.length > 0)
      {
        const init = {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify(productEdit)
        }
        console.log("Produkty w init: ");
        console.log(productEdit);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/product", init)
        .then(res =>
          {
            if(res.ok)
              return res.json();
            else
              throw new Error("Something wrong");
          })
        .then(
            (result) => {
              console.log("wszedl fetch");
              console.log(result);
              Promise.all(result.map((element, index) => {
                console.log(element);
                operationEdit[index].edited = 0;
                db.transaction("operations", "readwrite").objectStore("operations").put(operationEdit[index]);
                // resolve(true);
              }));
              resolve(true);
            },
            (error) => {
                console.log("blad edit");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
          )
      }
      else resolve(true);
    });
  }

  moveSync(products, productMove, operationMove, db) {
    return new Promise (resolve => {
      const devid = deviceID();
      if(productMove.length > 0)
      {
        const init = {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify(productMove)
        }
        console.log("Produkty w init: ");
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/product/move", init)
        .then(res =>
          {
            if(res.ok)
              return res.json();
            else
              throw new Error("Something wrong");
          })
        .then(
            (result) => {
              console.log("wszedl fetch");
              console.log(result);
              let conflicts = [];
              Promise.all(result.map((element, index) => {
                if(typeof(element.id) !== 'undefined') {
                  operationMove[index].moved = 0;
                  db.transaction("operations", "readwrite").objectStore("operations").put(operationMove[index]);
                }
                else if(element.message === "Too many to reduce")
                {
                  console.log(element.message);
                  const productindex = products.findIndex(prod => prod.id === productMove[index].id)
                  const quantityindex = products[productindex].quantity.findIndex(prod => prod.devid === devid);
                  if(quantityindex !== -1)
                  {
                    products[productindex].quantity[quantityindex].delta = element.quantity;
                    const reqPutProduct = db.transaction("products", "readwrite").objectStore("products").put(products[productindex]);
                    reqPutProduct.onsuccess = function(event) {
                      operationMove[index].moved = 0;
                      db.transaction("operations", "readwrite").objectStore("operations").put(operationMove[index]);
                      const quantity = quantitySum(products[productindex].quantity);
                      conflicts.push({...products[productindex], quantity:quantity});
                      if(index === result.length - 1)
                      {
                        localStorage.setItem("conflicts", JSON.stringify(conflicts));
                        console.log(conflicts);
                      }
                    }
                  }
                  
                }
              }));
              resolve(true);
            },
            (error) => {
                console.log("blad move");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
          )  
      }
      else resolve(true);
    });
  }

  getSync() {
    return new Promise(resolve => {
      const result = indexedDB.open(DBconfig.name, DBconfig.version);
      result.onsuccess = function(event) {
        const db = event.target.result;
        const getProd = db.transaction("products").objectStore("products").getAll();
        getProd.onsuccess = function(event) {
          const products = event.target.result;
          const devid = deviceID();
          const toDelete = products.map(element => {
            return {id:element.id, delete:true};
          })
          const init = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept':'*/*',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
          }
          console.log("Produkty w init: ");
          const HOST = window.location.hostname;
          fetch("https://"+HOST+":8002/product", init)
          .then(res => res.json())
          // .then(res =>
          //   {
          //     if(res.ok)
          //       return res.json();
          //     else
          //       throw new Error("Something wrong");
          //   })
          .then(
              (result) => {
                // console.log("wszedl fetch");
                // console.log(result);
                Promise.all(result.map((element, index) => {
                  if(toDelete.length > 0) {
                    const prodIndex = toDelete.findIndex(elem => elem.id === element.id);
                    if(prodIndex !== -1) {
                      toDelete[prodIndex].delete = false;
                    }
                  }
                  // if(element.manufacturer === "Prod4")
                  //       alert("begin; element.cat=" + element.category);
                  const prod = products.find(prod => prod.id === element.id);
                  if(prod === undefined)
                  {
                    // if(element.manufacturer === "Prod4")
                    //     alert("prod undefined; element.cat=" + element.category + "elem.id=" + element.id);
                    console.log("undefined");
                    const reqAdd = db.transaction("products","readwrite").objectStore("products").add(element);
                    reqAdd.onsuccess = function (event) {
                      const operation = {
                        id: element.id,
                        added: 0,
                        edited: 0,
                        moved: 0,
                        deleted: 0
                      }
                      db.transaction("operations","readwrite").objectStore("operations").add(operation);
                    }
                  }
                  else
                  {
                    console.log("quantityindex");
                    // if(element.manufacturer === "Prod4")
                    //     alert("begin quantityindex; element.cat=" + element.category + "elem.id=" + element.id);
                    const quantityindex = prod.quantity.findIndex(quan => quan.devid === devid)
                    if(quantityindex === -1)
                    {
                      console.log("quantityindex-1"); 
                      console.log(element);
                      // if(element.manufacturer === "Prod4")
                      //   alert("quantindex === -1; element.cat=" + element.category);
                      db.transaction("products","readwrite").objectStore("products").put(element);
                    }
                    else
                    {
                      console.log("quantityindex!=1"); 
                      // if(element.manufacturer === "Prod4")
                      //   alert("quantindex !== -1; element.cat=" + element.category);
                      const elementquantityindex = element.quantity.findIndex(quan => quan.devid === devid);
                      if(elementquantityindex !== -1)
                      {
                        console.log("elementquantityindex !== -1"); 
                        element.quantity[elementquantityindex].delta = prod.quantity[quantityindex].delta;
                        db.transaction("products","readwrite").objectStore("products").put(element);
                      }
                      else
                      {
                        console.log("elementquantityindex == -1"); 
                        element.quantity.push(prod.quantity[quantityindex]);
                        db.transaction("products","readwrite").objectStore("products").put(element);
                      }
                    }
                  }
                }));

                if(toDelete.length > 0) {
                  Promise.all(toDelete.map(element => {
                    if(element.delete)
                    {
                      // alert("To delete: "+ element.id);
                      const reqDel = db.transaction("products","readwrite").objectStore("products").delete(element.id);
                      reqDel.onsuccess = function() {
                        db.transaction("operations","readwrite").objectStore("operations").delete(element.id);
                      }
                    }
                  }));
                }
                resolve(true);
              },
              (error) => {
                  console.log("blad get");
                  console.log(error);
                  localStorage.setItem("sync", "sync-error");
                  resolve(false);
              }
            )
          }
      }
    });
  }

  // changeSync(handleSync,x) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       handleSync()
  //       resolve(true);
  //     }, 2000);
  //   });
  // }

  // async testSync(handleSync2) {
  //   const x = await this.changeSync(handleSync2,10);
  //   console.log(x);
  //   console.log(5);
  // }

  // handleSync = () => {
  //   this.setState({sync: !this.state.sync});
  // };

  handleMenu = (event) => {
    this.setState({anchorE: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorE: null});
  };

  handleUpdate = () => {
    // const cache = caches.open("warehouse-with-us");
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    });
    localStorage.setItem("version", this.props.version);
    localStorage.setItem("updated", true);
    window.location.href = "./";
  }

  async handleSync() {
    localStorage.setItem("sync", "sync-successful");
    this.setState({sync: true});
    const request = indexedDB.open(DBconfig.name, DBconfig.version);
    request.onerror = async function(event) {
      console.log("Somewhere error");
    }

    
    // Sync products
    await new Promise (resolve => {
      console.log("wszedl w product sync");
      request.onsuccess = async function(event) {
        console.log("wszedl request");
        const db = event.target.result;
        await syncCategories(db);
        console.log("categories synced");
        const reqAll = await db.transaction("products").objectStore("products").getAll();
        reqAll.onsuccess = async function(event) {
  
          console.log("wszedl All");
          const products = event.target.result;
          let productAdd = [];
          let operationAdd = [];
          let operationDel = [];
          let productMove = [];
          let operationMove = [];
          let productEdit = [];
          let operationEdit = [];
          const devid = deviceID();
          const reqOpe =  await db.transaction("operations").objectStore("operations").openCursor();
          reqOpe.onsuccess = async function(event) {
            const cursor = event.target.result;
            if(cursor)
            {
              const product = products.find(element => cursor.value.id === element.id);
              if(cursor.value.added)
              {
                const {id, ...obj} = product;
                productAdd.push(obj);
                operationAdd.push(cursor.value);
              }
              if(cursor.value.deleted)
              {
                operationDel.push({id: cursor.value.id});
              }
              if(!cursor.value.added && cursor.value.moved)
              {
                const quant = product.quantity.find(element => devid === element.devid)
                productMove.push({
                  id: product.id,
                  quantity: quant
                });
                operationMove.push(cursor.value);
              }
              if(!cursor.value.added && cursor.value.edited)
              {
                productEdit.push(product);
                operationEdit.push(cursor.value);
              }
              cursor.continue();
            }
            else
            {
              // Del operation
              await this.delSync(operationDel, db);
  
              // Add operation
              await this.addSync(productAdd, operationAdd, db);
  
              // Edit operation
              await this.editSync(productEdit, operationEdit, db);
  
              // Move operation
              await this.moveSync(products, productMove, operationMove, db);
  
              // Get products
              await this.getSync();
              resolve(true);
            }
          }.bind(this);
        }.bind(this);
      }.bind(this);
    });
    
    this.setState({sync: false});
    window.location.reload();
  };

  render() {
    const isOpen = Boolean(this.state.anchorE);

    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton> */}
            <Typography style={{flex: 1., color:'white'}} variant="h6">
              <Link to='/' style={{color:'white'}}>
                Warehouse with us ver {DBconfig.version}
              </Link>
            </Typography>

            {!this.props.online ? (
              <IconButton
              aria-label="offline"
              aria-controls="menu-appbar"
              aria-haspopup="false"
              color="inherit"
            >
                <SignalWifiOffIcon/>
              </IconButton>
            ) : null}

            {this.props.online && this.props.version > 0 ? (
              <IconButton
                    aria-label="update"
                    aria-controls="menu-appbar"
                    aria-haspopup="false"
                    onClick={this.handleUpdate}
                    color="inherit"
                  >
                    <SystemUpdateIcon/>
              </IconButton>
            ) : null}

            {this.props.isAuth ? (
              <div>
                {this.props.online ? (
                  <IconButton
                    aria-label="sync data"
                    aria-controls="menu-appbar"
                    aria-haspopup="false"
                    // onClick={this.handleSync}
                    onClick={() => this.handleSync()}
                    color="inherit"
                  >
                    <SyncIcon className={this.state.sync ? "Syncing" : ""}/>
                  </IconButton>
                ) : null}

                <IconButton
                  aria-label="category"
                  aria-controls="menu-appbar"
                  aria-haspopup="false"
                  // onClick={this.handleSync}
                  color="inherit"
                  component={Link}
                  to={'/category'}
                >
                  <CategoryIcon/>
                </IconButton>

                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorE}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={isOpen}
                  onClose={this.handleClose}
                >
                  <MenuItem className="place-around" onClick={() => {
                      this.handleClose();
                      this.props.logout();
                      }}>
                      Wyloguj się
                  </MenuItem>
                </Menu>
              </div>
            ) : ""}
          </Toolbar>
        </AppBar>
        <AppBar position="static">
          <Toolbar>
            <Typography style={{flex: 1}} variant="h6">
              Warehouse with us
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default MenuAppBar;