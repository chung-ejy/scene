import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export class Header extends Component {
    render() {
        return (
            <footer className="footer mt-3">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item">
                        <a className="nav-link px-2 text-muted"href="https://www.youtube.com/static?template=terms">
                            YouTube Terms of Service
                        </a></li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-muted"href="https://policies.google.com/privacy?hl=en-US">
                            Google Privacy Policy
                        </a></li>
                </ul>
            </footer>
        )
    }
}

export default Header
