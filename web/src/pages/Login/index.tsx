import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';

import './styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target; 
    
    setFormData({...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const {email} = formData;

    localStorage.setItem('@DescartOil-user', email);

    history.push('/points');
  }

  return (
    <div id="page-create-point">
      <form onSubmit={(handleSubmit)}>
        <fieldset>
          <legend>
            <h2>Login</h2>
          </legend>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;