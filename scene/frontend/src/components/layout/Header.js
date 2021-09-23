import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export class Header extends Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid text-center justify-content-center">
                <a href="/" ><i className="navbar-brand fas fa-film text-white fa-3x"></i></a>
                <a><Link to="/" class="navbar-brand" >Scene</Link></a>
                    {/* <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a><Link class="navbar-brand" to="/terms_of_service">Terms of Service</Link></a>
                        </li>
                    </ul>
                    </div> */}
                </div>
            </nav>
        )
    }
}

export default Header
