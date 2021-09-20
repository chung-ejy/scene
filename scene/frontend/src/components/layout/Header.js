import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export class Header extends Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg item-center navbar-dark bg-primary">
                <div class="container-fluid">
                    <li><Link to="/" class="navbar-brand mx-auto" >Scene</Link></li>
                    <li><Link class="navbar-brand mx-auto" to="/terms_of_service">Terms of Service</Link></li>
                </div>
            </nav>
        )
    }
}

export default Header
