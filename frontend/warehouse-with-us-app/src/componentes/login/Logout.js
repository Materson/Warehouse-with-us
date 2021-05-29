import React from 'react';

class Logout extends React.Component {
    render() {
        return (
            <div className="navbar-item">
                <div className="buttons">
                    {!this.props.isAuth ? (
                    <button className="button is-white" onClick={this.props.login}>
                        Log in
                    </button>
                    ) : (
                    <button className="button is-black" onClick={this.props.logout}>
                        Log out
                    </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Logout;