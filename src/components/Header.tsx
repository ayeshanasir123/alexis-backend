// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Styles/logo.png';
import { handleLogout } from '../services/api';
import styled from 'styled-components';

const Nav = styled.nav`
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.a`
    display: flex;
    align-items: center;
    
`;

const Button = styled.button`
    background-color: #0d6efd;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0a58ca;
    }
`;

const Header: React.FC = () => {
    const navigate = useNavigate();

    const logout = () => {
        handleLogout(navigate);
    };

    return (
        <Nav>
            <Logo href="/">
                <img src={logo} alt="Alexis" />
            </Logo>
            <Button onClick={logout}>Log out</Button>
        </Nav>
    );
};

export default Header;
