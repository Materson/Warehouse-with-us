import React from 'react';
import {Redirect} from 'react-router-dom';

class WithAuth extends React.Component {
    render() {
        const Component = this.props.component;
        const isAuth = this.props.isAuth;
    
        return (
            <div>
                {isAuth ? (
                    <Component match={this.props.match} {...this.props}/>
    
                ) : (
                    <Redirect to="/" />
                )}
            </div>
        );
    }
  }

  export default WithAuth;