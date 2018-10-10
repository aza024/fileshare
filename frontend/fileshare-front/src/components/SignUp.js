import React, { Component } from 'react'
import axios from 'axios';

class SignUp extends Component{
    constructor (){
        super()
        
        this.state = {
            username: "",
            password: "",
            email: ""
        }
    }
    handleUsernameInput = (e) => {
        console.log("handleUsernameIn")
        this.setState({
            username: e.target.value
        })
    }
    handlePasswordInput = (e) => {
        console.log("handlePasswordIn")
        this.setState({
            password: e.target.value
        })
    }

    handleEmailInput = (e) => {
        console.log("handleEmailInput")
        this.setState({
            email: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        axios.post('localhost:3000/user', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    render() {
        return(
         <div className = "createAccount">
            <div className = "createAccForm">
                <h1> createAccount </h1>

                <form onSubmit={this.onSubmit}>
                    <input text = "Username" ref="username" value={this.state.username} onChange={this.handleUsernameInput}
                    type="text"/>

                    <input text = "Password" ref="password" value={this.state.password} onChange={this.handlePasswordInput} type="text"/>

                    <input text = "Email Address" ref="email" value={this.state.email} onChange={this.handleEmailInput}type="text"/>

                    <button type="submit" className="button button_wide">CREATE ACCOUNT</button>
                </form>
            </div>
         </div>
        )
    }
}

export default SignUp;