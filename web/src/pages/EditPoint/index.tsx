import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {FiArrowLeft} from 'react-icons/fi';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo2.svg';

interface Point {
  id: number;
  city: string,
  uf: string,
  image_url: string,
  name: string,
  email: string,
  offer: string,
  whatsapp: string,
  latitude: number,
  longitude: number,
}

interface Location {
  location: {
    state: {
      point: Point;
    };
  };
}

interface IBGEUFResponse {
  sigla: string,
}

interface IBGECityResponse {
  nome: string,
}

const EditPoint = ({location}: Location) => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [point, setPoint] = useState<Point>(location.state.point);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([point.latitude, point.longitude]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    offer: '',
  });

  const [selectedUf, setSelectedUf] = useState(point.uf);
  const [selectedCity, setSelectedCity] = useState(point.city);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleLogOut() {
    localStorage.removeItem('@DescartOil-user');

    history.push('/');
  }

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target; 
    
    setFormData({...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const {name, email, whatsapp, offer} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;

    const user_email = localStorage.getItem('@DescartOil-user');

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('offer', offer);
    data.append('user_email', String(user_email));
    
    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.patch(`/points/${point.id}`, data);

    alert('Ponto de coleta atualizado!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
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

      <form onSubmit={handleSubmit}>
        <h1>Edição do <br /> ponto de coleta</h1>
        
        <Dropzone onFileUploaded={setSelectedFile}  />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              defaultValue={point.name}
            />
          </div>

          <div className="field">
            <label htmlFor="name">Proposta</label>
            <input
              type="text"
              name="offer"
              id="offer"
              onChange={handleInputChange}
              defaultValue={point.offer}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                defaultValue={point.email}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
                defaultValue={point.whatsapp}
              />
             </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}  
              </select>
            </div>
          </div>
        </fieldset>
        <button type="submit">
          Atualizar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default EditPoint;