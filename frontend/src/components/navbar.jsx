import React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Api } from '../api'
import {Navbar, Nav, NavItem, Container} from 'react-bootstrap';

export class NavBar extends React.Component {
    api = new Api();

    state = {
        isLoggedIn: false,
        username: "",
        menu: [],
    }

    constructor() {
        super();
        this.api.getCurrentUser()
            .then(data => {
                console.log("navbar loaded")
                console.log(data)
                this.setState({username: data["username"]})
            })
            .catch(err => this.setState({isLoggedIn: true}))

    }

    logOut() {
        this.api.logOut(this.state).then(
            data => {
                console.log(data)
                if (data["code"] == 0){
                    alert(data.msg);
                } else {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('username');
                    sessionStorage.removeItem('role');
                }
            }
        )
        

    }

    render() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            return <Redirect to="/" />
        }
        return (
            <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/dashboard">Seed and Lead</Navbar.Brand>
                    <Nav className="me-auto">
                        {sessionStorage.getItem("role") == 'T' && <Nav.Link href="/myClasses">Manage Classes</Nav.Link>}
                        {sessionStorage.getItem("role") == 'T' && <Nav.Link href="/createCampaign">Create Campaign</Nav.Link>}
                        {sessionStorage.getItem("role") == 'T' && <Nav.Link href="/viewProgressT">View Progress</Nav.Link>}
                        {sessionStorage.getItem("role") == 'S' && <Nav.Link href="/logWork">Log Work</Nav.Link>}
                        {sessionStorage.getItem("role") == 'S' && <Nav.Link href="/createGoal">Set Goal</Nav.Link>}
                        {sessionStorage.getItem("role") == 'S' && <Nav.Link href="/viewProgress">View Progress</Nav.Link>}

                    </Nav>
                    <Nav className="ms-auto">
                        <NavLink className="dropdown-item" to='/'
                            onClick={() => this.logOut()}>
                            Logout
                         </NavLink>
                    </Nav>
            </Container>
            </Navbar>
        );
    }

}
