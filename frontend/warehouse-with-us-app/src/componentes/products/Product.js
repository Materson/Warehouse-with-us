import React from 'react';
import BottomNav from './BottomNav';
import ProductInfo from './ProductInfo';
import {Container, Grid} from '@material-ui/core';

import {DBconfig} from '../../DBconfig';
import {quantitySum} from './utils';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFunction: ProductInfo,
            data: {},
            isLoaded: false,
            categories: []
        };
    }

    componentDidMount() {
        this.setState({isLoaded: false});
        const { id } = this.props.match.params;

        const request = indexedDB.open(DBconfig.name, DBconfig.version);
        let offlineDB = {};
        let offlineCategories = [];
        request.onsuccess = function(event) {
            const db = event.target.result;

            const reqGetCategories = db.transaction("categories").objectStore("categories").getAll();
            reqGetCategories.onsuccess = function(event) {
                event.target.result.map(row => {
                    offlineCategories.push(row);
                });
                this.setState({
                    categories: offlineCategories
                });
            }.bind(this);

            const reqGet = db.transaction("products").objectStore("products").get(id);
            reqGet.onsuccess = function(event) {
                const data = event.target.result;
                if(data === undefined)
                {
                    this.props.history.push("/");
                    return 0;
                }
                let quantity = 0;
                if(typeof(data.quantity) !== 'undefined' && data.quantity.length > 0)
                {
                    quantity = quantitySum(data.quantity);
                }
                offlineDB = {...data, quantity:quantity};
                this.setState({
                    data: offlineDB,
                    isLoaded: true
                });
            }.bind(this);
        }.bind(this);

        // const HOST = window.location.hostname;
        // const init = {
        //     method: "GET",
        //     mode: 'cors',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept':'*/*',
        //         'Authorization': 'Bearer ' + localStorage.getItem("token")
        //       },
        //   };
        // fetch('https://'+HOST+':8002/product/'+id, init)
        // .then(res =>
        //     {
        //       if(res.ok)
        //         return res.json();
        //       else
        //         throw new Error("Something wrong");
        //     })
        // .then(
        //     (result) => {
        //         const request = indexedDB.open(DBconfig.name, DBconfig.version);
        //         const devid = deviceID();
        //         request.onsuccess = function(event) {
        //             const db = event.target.result;
        //             const reqGet = db.transaction("products").objectStore("products").get(result.id);
        //             reqGet.onsuccess = function(event) {
        //                 let data = event.target.result;
        //                 // keep local value of this device
        //                 const localIndex = data.quantity.findIndex(element => element.devid === devid);
        //                 if(localIndex !== -1)
        //                 {
        //                     const netIndex = result.quantity.findIndex(element => element.devid === devid);
        //                     if(netIndex !== -1 && !!result.quantity.length)
        //                     {
        //                         result.quantity[netIndex] = data.quantity[localIndex];
        //                     }
        //                     else
        //                     {
        //                         result.quantity.push(data.quantity[localIndex]);
        //                     }
        //                 }
        //                 data.quantity = result.quantity;
        //                 const reqPut = db.transaction("products", "readwrite").objectStore("products").put(data);
        //                 reqPut.onerror = function(event) {
        //                     console.log("DB put error: " + event.target.errorCode);
        //                 }
        //                 // print element
        //                 let newResult = {};
        //                 const quantity = data.quantity.reduce((preVal, curVal) => {
        //                     return preVal + curVal.local + curVal.delta;
        //                 },0)
        //                 newResult = {...data, quantity:quantity};
        //                 console.log(newResult);
        //                 this.setState({
        //                     isLoaded: true,
        //                     data: newResult
        //                 });
        //             }.bind(this);
        //         }.bind(this);                
        //     },
        //     (error) => {
        //         this.setState({
        //             isLoaded: false,
        //         });
      
        //         const request = indexedDB.open(DBconfig.name, DBconfig.version);
        //         let offlineDB = {};
        //         request.onsuccess = function(event) {
        //             const db = event.target.result;
        //             const reqGet = db.transaction("products").objectStore("products").get(id);
        //             reqGet.onsuccess = function(event) {
        //                 const data = event.target.result;
        //                 const quantity = data.quantity.reduce((preVal, curVal) => {
        //                     return preVal + curVal.local + curVal.delta;
        //                 },0)
        //                 offlineDB = {...data, quantity:quantity};
        //                 this.setState({
        //                     data: offlineDB,
        //                     isLoaded: true
        //                 });
        //             }.bind(this);
        //         }.bind(this);
        //     }
        // )
    }

    handleChangeFunction = (Component) => {
        this.setState({
            currentFunction: Component
        });
    }

    handleChangeQuantity = (quantity) => {
        const newProduct = {...this.state.data, quantity: this.state.data.quantity + quantity};

        this.setState({
            data: newProduct
        });
    }

    handleChangeData = (product) => {
        const newProduct = {...product};

        this.setState({
            data: newProduct
        });
    }

    render() {
        return (
            <div>
            { this.state.data ? (
                <div>
                    <Container component="main" maxWidth="xs">
                        <Grid container>
                            <Grid item xs={12}>
                                <this.state.currentFunction
                                    categories={this.state.categories}
                                    product={this.state.data}
                                    changeData={this.handleChangeData}
                                    changeQuantity={this.handleChangeQuantity}
                                    handleAPI={this.props.handleAPI}
                                    isLoaded={this.state.isLoaded}
                                    changeFunction={this.handleChangeFunction}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="flex-end" justify="center">
                            <Grid item xs={12}>
                                <BottomNav changeFunction={this.handleChangeFunction}/>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            ) : (
                <div>
                    <p className="text-danger">Brak takiego produktu</p>
                </div>
            )}
            </div>
        );
    }
}

export default Product;