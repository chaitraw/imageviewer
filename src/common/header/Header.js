import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import profileImage from "../../assets/upgrad.svg"
import { MenuList } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom'

import "./Header.css";

const styles = (theme => ({
    menuItems: {
        "text-decoration": "none",
        "color": "black",
        "text-decoration-underline": "none",
    },
    searchText: {
        "position": "relative",
        "width": "100%",
    },
    menuList: {
        "width": "150px",
        padding: "0px"

    }

}))



class Header extends Component {
    constructor() {
        super();
        this.state = {
            isMenuOpen: false,
            isLoggedIn: true,
        };

    }

    menuClickedHandler = () => this.setState({
        ...this.state,
        isMenuOpen: !this.state.isMenuOpen
    })

    profileButtonClickedHandler = (event) => {
        this.state.anchorEl ? this.setState({ anchorEl: null }) : this.setState({ anchorEl: event.currentTarget });
        this.menuClickedHandler();
    };

    // This method is called when text is entered into search input, 
    onSearchChangeHandler = (event) => {
        this.props.onSearchTextChange(event.target.value);
    }

    //This method is called when log out is clicked in the menu 
    logoutClickedHandler = (event) => {
        sessionStorage.removeItem("access-token");
        this.setState({
            isLoggedIn: false
        })
    }

    //This method is called to redirect to login page
    redirectToLogin = () => {
        if (!this.state.isLoggedIn) {
            return <Redirect to="/" />
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <div>

                {this.redirectToLogin()}

                <header className="app-header">
                    <a href='/home' id="app-logo">Image Viewer</a>

                    {this.props.showSearchBox ?
                        <span className="header-searchbox">
                            <SearchIcon id="search-icon"></SearchIcon>
                            <Input className={classes.searchText} placeholder="Search…" disableUnderline={true} onChange={this.onSearchChangeHandler} />
                        </span>
                        : <span className="header-searchbox-false" />
                    }

                    {this.props.showProfileIcon ? 
                        <span>

                            <IconButton id="profile-icon" onClick={event => this.profileButtonClickedHandler(event)}>
                                <img src={this.props.profile_picture} alt={profileImage} id="profile-picture" />
                            </IconButton>

                            <Menu id="profile-menu" anchorEl={this.state.anchorEl} open={this.state.isMenuOpen} onClose={this.profileButtonClickedHandler}>
                                <MenuList className={classes.menuList}>
                                    {this.props.showMyAccount === true ?
                                        <div>
                                            <Link to={"/profile"} className={classes.menuItems} underline="none" color={"default"}>
                                                <MenuItem className={classes.menuItems} onClick={this.onMyAccountClicked} disableGutters={false}>My account</MenuItem>
                                            </Link>

                                            <div className="horizontal-line"> </div>
                                        </div>
                                        : ""
                                    }

                                    <MenuItem className="menu-items" onClick={this.logoutClickedHandler}>Logout</MenuItem>

                                </MenuList>
                            </Menu>

                        </span>
                        : ""
                    }

                </header>

            </div>
        )
    }
}

export default withStyles(styles)(Header);