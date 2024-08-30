import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            if (response.SUCCESS) {
                navigate('/Posts');
            } else {
                setError('Login failed: ' + response.MESSAGE);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setError(errorMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '200px' }}>
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center mb-4">Login</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
            </div>
        </div>
    );
};

export default Login;
