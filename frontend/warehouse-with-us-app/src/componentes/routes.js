import React from 'react'
import {
    Switch,
    Route,
    withRouter,
    Redirect
  } from "react-router-dom";
import {Grid} from '@material-ui/core';

import {Login, IntegratedRegister} from './login/Login';
import Products from './products/Products';
import Product from './products/Product';
import ProductAdd from './products/ProductAdd';
import WithAuth from './withAuth'
import MenuAppBar from './HeadBar/HeadBar';
import ScrollDialog from './Dialog';
import CategoryList from './category/CategoryList';
import {checkDefaultCategory} from './category/utils';

// initDB(DBConfig);

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: !!localStorage.getItem("token"),
            sync: localStorage.getItem("sync"),
            updated: localStorage.getItem("updated"),
            newVersion: 0,
            manager:false,
            online: true
        }
    }

    handleLoginUser = (token) => {
        localStorage.setItem("token", token);
        const init = {
            method: "GET",
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept':'*/*',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
          }
          const HOST = window.location.hostname;
          fetch("https://"+HOST+":8002/user",init)
            .then(res => res.json())
            .then(
              (result) => {
                localStorage.setItem("manager", true);
              },
              (error) => {
                console.log("error")
              }
            )
        
        this.setState({
            login: true
        });
        this.props.history.push("/");
    };

    handleLogoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("manager");
        this.setState({
            login: false,
        });
        this.props.history.push("/");
    };

    handleSync = () => {
        this.setState({sync:true});
    }

    onlineListener = () => {
        const condition = navigator.onLine ? true : false;
        this.setState({online: condition});
    }

    componentDidMount() {
        window.addEventListener('online',  this.onlineListener);
        window.addEventListener("offline", this.onlineListener);
        localStorage.removeItem("sync");

        const init = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept':'*/*'
            }
        }
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/version", init)
        .then(res => res.json())
        .then(
            (result) => {
            if(localStorage.getItem("version") !== null)
            {
                const version = localStorage.getItem("version");
                if(version < result.version)
                {
                    this.setState({
                        newVersion: result.version
                    });
                }
            }
            else
            {
                localStorage.setItem("version", result.version);
            }
            },
            (error) => {
                console.log("blad get");
                console.log(error);
            }
        )

        checkDefaultCategory();
    }

    // handleAPI = (url, method, params) => {
    //     let init;
    //     if (this.state.login) {
    //         init = {
    //             method: method,
    //             mode: 'cors',
    //             headers: {
    //               'Content-Type': 'application/json',
    //               'Accept':'*/*',
    //               'Authorization': 'Bearer ' + localStorage.getItem("token")
    //             },
    //             body: JSON.stringify(params)
    //         }
    //     } else {
    //         init = {
    //             method: method,
    //             mode: 'cors',
    //             headers: {
    //               'Content-Type': 'application/json',
    //               'Accept':'*/*'
    //             },
    //             body: JSON.stringify(params)
    //         }
    //     }
    //     console.log("Dane do wyslania");
    //     console.log(params);
    //     const HOST = window.location.hostname;
    //     return fetch("https://"+HOST+":8002"+url, init)
    //     .then(res => res.json())
    //     .then(
    //         (result) => {
    //         // this.setState({
    //         //   isLoaded: true,
    //         //   items: result.items
    //         // });
    //             console.log(result);
    //             return result;
    //         },
    //         (error) => {
    //             console.log("blad");
    //             console.log(error);
    //         }
    //     )
    // }

    render() {
        return (
            <div className="full-height">
                {(this.state.sync !== null) ? (
                    <ScrollDialog func={this.state.sync}/>
                ) : ("")}

                {(this.state.updated !== null) ? (
                    <ScrollDialog func="updated"/>
                ) : ("")}

                <Grid container direction='column'>
                    <Grid item>
                        <MenuAppBar login={this.handleLoginUser} logout={this.handleLogoutUser} isAuth={this.state.login} version={this.state.newVersion} online={this.state.online}/>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <Switch>
                                <Route exact path="/" render={this.state.login ? () => <Products history={this.props.history} logout={this.handleLogoutUser} sync={this.state.sync}/> : () => <Login login={this.handleLoginUser} online={this.state.online} handleAPI={this.handleAPI}/>}/>
                                {/* <Route path="/product/:id" component={withAuth(Product)}/>   */}
                                <Route path="/product/add" render={(props) => <WithAuth component={ProductAdd} isAuth={this.state.login}  {...props}/>}/>
                                {/* <Route path="/product/:id/supply" render={(props) => <WithAuth  component={ProductSupply} isAuth={this.state.login} {...props}/>}/>
                                <Route path="/product/:id/deliver" render={(props) => <WithAuth component={Product} isAuth={this.state.login} {...props}/>}/>
                                <Route path="/product/:id/edit" render={(props) => <WithAuth component={Product} isAuth={this.state.login} {...props}/>}/> */}
                                <Route path="/product/:id" render={(props) => <WithAuth component={Product} isAuth={this.state.login}  {...props}/>}/>
                                <Route path="/register" render={this.state.login ? () => <Redirect to="/"/> : () => <IntegratedRegister online={this.state.online}/>}/>
                                <Route path="/category" render={this.state.login ? () => <CategoryList/> : () => <Redirect to="/"/>}/>
                            </Switch>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );

    }
}

  export default withRouter(Routes);