import React, { useState } from 'react';
import './Login.css';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [address, setAddress] = useState('');

    const handleLoginOrRegister = async (e) => {
        e.preventDefault();

        const endpoint = 'https://four30finalback-1.onrender.com/login/';
        const payload = { email, password, isRegistering, name: userName, address };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                console.log("Data from login:", data)
                onLoginSuccess(data.user_id, data.user_name);  // Pass user_id and users_name on success
                onClose();  // Close the modal only if login/registration is successful
            }
        } catch (error) {
            console.error("Error with login/registration:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleLoginOrRegister}>
                    {isRegistering && (
                        <>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required={isRegistering}
                                />
                            </label>
                            <label>
                                Address (optional):
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </label>
                        </>
                    )}
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label className="register-checkbox">
                        <input
                            type="checkbox"
                            checked={isRegistering}
                            onChange={() => setIsRegistering(prev => !prev)}
                        />
                        Register as new user
                    </label>
                    <button type="submit" className="auth-submit-button">
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>
                <button onClick={onClose} className="close-modal-button">Close</button>
            </div>
        </div>
    );
};

export default Login;
