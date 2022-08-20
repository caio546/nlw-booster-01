import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

import api from '../../services/api';

import logo from '../../assets/logo2.svg';

import './styles.css';

interface Point {
  id: number;
  city: string,
  uf: string,
  image_url: string,
  name: string,
  email: string,
  offer: string,
}

const PointsListing = () => {
  const [points, setPoints] = useState<Point[]>([]);

  const history = useHistory();

  useEffect(() => {
    const user_email = localStorage.getItem('@DescartOil-user');

    api.get('/specific_points', {
      params: {
        user_email,
      }
    }).then((response) => {
      setPoints(response.data);
    });
  }, []);

  function handleLogOut() {
    localStorage.removeItem('@DescartOil-user');

    history.push('/');
  }

  async function handleOnRemove(id: number) {
    await api.delete(`/points/${id}`);

    window.location.reload();
  }

  function handleOnEdit() {
    console.log('Editar');
  }

  return (
    <div id="page-points">
      <header>
        <img src={logo} width={200} alt="DescartOil"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>

        <Link to="/points">
          Meus pontos de coleta
        </Link>

        <Link to="/create-point">
          Criar ponto de coleta
        </Link>

        <button type="button" onClick={handleLogOut}>
          Sair
        </button>
      </header>

      <main>
        {points.length !== 0 ? points.map((point) => (
          <section key={point.id}>
            <img width={250} src={point.image_url} alt={point.name} />
            <div>
              <div>{point.name}</div>
              <div>{point.offer}</div>

              <button type='button' onClick={() => handleOnRemove(point.id)}>Remover</button>
              <Link to={{pathname: "/edit-point", state: {point}}}>Editar</Link>
            </div>
          </section>
        )): (
          <div>Nenhum ponto de coleta cadastrado!</div>
        )}
      </main>
    </div>
  );
}

export default PointsListing;