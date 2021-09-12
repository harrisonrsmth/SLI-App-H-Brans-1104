import React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Api } from '../../api'

export class NavBar extends React.Component {
    api = new Api();

    state = {
        isLoggedIn: false,
        user: {
            firstName: "",
        },
        menu: [],
    }

    constructor() {
        super();
        this.api.getCurrentUser()
            .then(data => {
                console.log("navbar loaded")

            })
            .catch(err => this.setState({isLoggedIn: true}))

    }

    logOut() {
        localStorage.removeItem('token');
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-items" aria-controls="navbar-items" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>

            <Link to="/home" className="navbar-brand mr-0 mr-md-2">
            <img src={process.env.PUBLIC_URL + '/yoyo.png'} height="30" className="d-inline-block align-top mr-1" alt=""/>
            </Link>
            <div className="collapse navbar-collapse" id="navbar-items">
            <ul className="nav navbar-nav mr-auto">
            {
            this.state.menu.map((item, id) => {
            if (this.state.user.roleMask & (1 << (id + 1))) {
            return (
            <li className="nav-item" key={id}>
            <NavLink className="nav-link" to={item.path} activeClassName="active" >
            {item.name}
            </NavLink>
            </li>
            )
            }
            })
            }
            </ul>
            { this.state.user.id &&
            <li className="nav-item d-inline dropdown mr-2">
            <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Hello {this.state.user.firstName}
            </NavLink>
            <div className="dropdown-menu dropdown-navbar" aria-labelledby="navbarDropdownMenuLink">
            {
            (() => {
            if (this.state.user.roleMask & 1) {
            return (
            <>
            <NavLink className="dropdown-item" to={`/admin/users`}>Manage Users</NavLink>
            <NavLink className="dropdown-item" to={`/admin/products`}>Manage Products</NavLink>
            <NavLink className="dropdown-item" to={`/admin/emails`}>Manage Emails</NavLink>
            </>
            );
            }
            })()
            }
            <NavLink className="dropdown-item" to='/logout/'
            onClick={() => this.logOut()}>
            Logout
            </NavLink>
            </div>
            </li>
            }
            </div>
            </nav>
        );
    }

}
