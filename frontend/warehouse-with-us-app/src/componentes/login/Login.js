import React from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './Login.css';

// class IntegratedLogin extends React.Component {
//     render() {
//         return (
//             <form>
//                 <div className="form-group">
//                     <label for="InputEmail1">Adres e-mail</label>
//                     <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" placeholder="Wprowadź e-mail"/>
//                 </div>
//                 <div className="form-group">
//                     <label for="InputPassword">Hasło</label>
//                     <input type="password" class="form-control" id="InputPassword" placeholder="Hasło"/>
//                     <button className="btn btn-primary">Zaloguj się</button>
//                 </div>
//             </form>
//         );
//     }
// }

class IntegratedRegister extends React.Component {
    render() {
        return (
            <SignUp handleAPI={this.props.handleAPI} online={this.props.online}/>
        );
    }
}

// class Integrated extends React.Component {
//     render() {
//         return (
//             <div>
//                 <IntegratedLogin/>
//             </div>
//         )
//     }
// }

// class ThirdSide extends React.Component {
//     render() {
//         return (
//             <div>
//                 <button className="btn btn-danger btn-block place-around">Google</button>
//             </div>
//         );
//     }
// }

class Login extends React.Component {
    render() {
        return (
            <div>
                <SignIn login={this.props.login} handleAPI={this.props.handleAPI} online={this.props.online}/>
                {/* <ThirdSide/> */}
            </div>
        );
    }
}

export {Login, IntegratedRegister};