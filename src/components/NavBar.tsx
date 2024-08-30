// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFileAlt, FaTags } from 'react-icons/fa'; // Importing icons from react-icons
import logo from '../Styles/logo.png';

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    width: 250px;
    background-color: #1e2022;
    height: 100vh;
    padding: 20px;
    color: white;
`;

const NavLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    img {
        width: 150px;
    }
`;

const NavMenu = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
`;

const NavItem = styled.li`
    margin: 10px 0;
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: #ffffff;
    padding: 20px 15px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    font-weight: bold; // Making the text bold

    &:hover {
        background-color: #333;
        color: white;
    }

    &.active {
        background-color: #6f42c1;
        color: white;
    }

    svg {
        margin-right: 10px; // Adding space between the icon and text
    }
`;

const NavBar: React.FC = () => {
    return (
        <Nav>
            <NavLogo>
                <img src={logo} alt="Logo" /> {/* Replace with your logo */}
            </NavLogo>
            <NavMenu>
                <NavItem>
                    <NavLink to="/Posts">
                        <FaFileAlt /> {/* Icon for Posts */}
                        Posts
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/Offers">
                        <FaTags /> {/* Icon for Offers */}
                        Offers
                    </NavLink>
                </NavItem>
            </NavMenu>
        </Nav>
    );
};

export default NavBar;
