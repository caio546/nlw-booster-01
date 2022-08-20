import React from 'react';
import {FiLogIn} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import './styles.css';

import logo2 from '../../assets/logo2.svg';

const Home = () => {
  const user_email = localStorage.getItem('@DescartOil-user');

  console.log(user_email);

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo2} alt="Ecoleta"/>
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          {user_email ? (
            <Link to="/points">
              <span>
                <FiLogIn />
              </span>
              <strong>Veja seus pontos de coleta</strong>
            </Link>
          ) : (
            <Link to="/login">
              <span>
                <FiLogIn />
              </span>
              <strong>Faça login</strong>
            </Link>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;