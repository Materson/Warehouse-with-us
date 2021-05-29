import React from 'react';
import {Link} from 'react-router-dom';
import {styled} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Typography} from '@material-ui/core';

import "./Products.css"
import {DBconfig} from '../../DBconfig';
import {quantitySum, compareProductsByCategory} from './utils';

const FloatFab = styled(Fab) ({
    position: 'fixed',
    bottom: '30px',
    right: '30px',
})

class ProductsTable extends React.Component {
    render() {
      const history = this.props.history;
      const handleRowClick = (id) => {
        history.push('/product/'+id);
      }
        return (
            <TableContainer component={Paper}>
            <Table aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell>Kategoria</TableCell>
                  <TableCell align="right">Producent</TableCell>
                  <TableCell align="right">Model</TableCell>
                  <TableCell align="right">Cena</TableCell>
                  <TableCell align="right">Ilość</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.products.sort(compareProductsByCategory(this.props.categories)).map((row) => (
                    <TableRow key={row.id} className="tr-link">
                        <TableCell onClick={() => handleRowClick(row.id)}>
                          <Typography>
                            {this.props.categories.find(element => element.id === row.category) === undefined ? (
                              "-"
                            ) : (
                              this.props.categories.find(element => element.id === row.category).name
                            )}
                            {/* {row.category} */}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" onClick={() => handleRowClick(row.id)}>
                          <Typography>
                            {row.manufacturer}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" onClick={() => handleRowClick(row.id)}>
                          <Typography>
                            {row.model}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" onClick={() => handleRowClick(row.id)}>
                          <Typography>
                            {row.price}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" onClick={() => handleRowClick(row.id)}>
                          <Typography>
                            {row.quantity}
                          </Typography>
                        </TableCell>
                        {/* </Link> */}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
    }
}

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      products: [],
      name: "",
    };
  }

  async fetchCategories() {
    let offlineCategories = [];
    return new Promise(resolve => {
      const request = indexedDB.open(DBconfig.name, DBconfig.version);
      request.onsuccess = function(event) {
        const db = event.target.result;
        const reqGetCategories = db.transaction("categories").objectStore("categories").getAll();
        reqGetCategories.onsuccess = function(event) {
          event.target.result.map(row => {
            offlineCategories.push(row);
          });
          resolve(offlineCategories);
        }
      }
    });
  }

  async fetchProducts() {
    let offlineProducts = [];
    return new Promise(resolve => {
      const request = indexedDB.open(DBconfig.name, DBconfig.version);
      request.onsuccess = function(event) {
        const db = event.target.result;
        const reqGet = db.transaction("products").objectStore("products").getAll();
        reqGet.onsuccess = function(event) {
          event.target.result.map((row) => {
            const quantity = quantitySum(row.quantity);
            offlineProducts.push({...row, quantity:quantity});
          });
          resolve(offlineProducts);
        }
      }
    });
  }

  componentDidMount() {
    this.setState({
      categoriesLoaded: false,
      productsLoaded: false,
      products: [],
      categories: [],
      operations: []
    });

    const request = indexedDB.open(DBconfig.name, DBconfig.version);
    let offlineDB = [];
    // let offlineOperations = [];
    // let offlineCategories = [];
    this.fetchCategories().then(offlineCategories => {
      this.setState({
        categories: offlineCategories,
        categoriesLoaded: true
      });
    });

    this.fetchProducts().then(offlineProducts => {
      this.setState({
        products: offlineProducts,
        productsLoaded: true
      });
    });

    request.onsuccess = function(event) {
      const db = event.target.result;
      // const reqGetCategories = db.transaction("categories").objectStore("categories").getAll();
      // reqGetCategories.onsuccess = function(event) {
      //   event.target.result.map(row => {
      //     offlineCategories.push(row);
      //   });
      //   this.setState({
      //     categories: offlineCategories
      //   });
      // }.bind(this);
      
      const reqGet = db.transaction("products").objectStore("products").getAll();
      reqGet.onsuccess = function(event) {
        event.target.result.map((row) => {
          const quantity = quantitySum(row.quantity);
          offlineDB.push({...row, quantity:quantity});
        });
        this.setState({
          products: offlineDB
        });
        // const reqGetOper = db.transaction("operations").objectStore("operations").getAll();
        // reqGetOper.onsuccess = function(event) {
        //   event.target.result.map((row) => {
        //     offlineOperations.push({...row});
        //   });
        //   this.setState({
        //     operations: offlineOperations
        //   });
        // }.bind(this);
      }.bind(this);
    }.bind(this);
    
    this.setState({
      isLoaded: true
    });
  }

    render() {
        return (
            <div>
                <FloatFab size="medium" color="secondary" aria-label="add"  component={Link} to={'/product/add'}>
                  <AddIcon/>
                </FloatFab>
                <Typography id="name"></Typography>
                {this.state.categoriesLoaded && this.state.productsLoaded ? (
                  <ProductsTable categories={this.state.categories} products={this.state.products} history={this.props.history}/>
                ) : (
                  <Typography>Ładowanie...</Typography>
                )
                }    
                {/* <Typography>{JSON.stringify(this.state.products)}</Typography>
                <Typography>{JSON.stringify(this.state.operations)}</Typography> */}
            </div>
        );
    }
}

export default Products;