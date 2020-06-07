import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
//Leaflet MAP:
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from "axios";
import "./styles.css";
import logo from "../../assets/logo.svg";
//Dropzone:
//import Dropzone from "react-dropzone";
import Dropzone from "../../components/Dropzone";




interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [cities, setCities ] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0, 0]);

    const history = useHistory();

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(position => { 
            
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])

         })

    }, [])

    useEffect(() => {

        api.get('items').then(res => {
            setItems(res.data)
        })

    }, [])

    useEffect(() => {

        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(res => {
            
            const ufInitials = res.data.map(uf => uf.sigla)

            setUfs(ufInitials)

        })

    }, [])

    useEffect(() => {

        if(selectedUf === '0') return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
            
            const cityNames = res.data.map(city => city.nome)

            setCities(cityNames)

        })

    }, [selectedUf])

    function handleSelectUf(e: ChangeEvent<HTMLSelectElement>) {

        const uf = e.target.value

        setSelectedUf(uf)
        
    }

    

    function handleSelectCity(cityEvent: ChangeEvent<HTMLSelectElement>) {

        const city = cityEvent.target.value

        setSelectedCity(city)
        
    }

    function handleMapClick(mapEvent: LeafletMouseEvent) {
      //Console test:
      console.log('SelectedPosition:','\nLat:', mapEvent.latlng.lat,'Lng:', mapEvent.latlng.lng);

        setSelectedPosition([
            mapEvent.latlng.lat,
            mapEvent.latlng.lng
        ])

    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
      //Console test:
      console.log(event.target.name, event.target.value); //Lista os dados digitados no console do browser (F12)
        const { name, value } = event.target

        setFormData({ ...formData, [name]: value})
        

    }

    function handleSelectedItem(id: number){      
      //Console test:
      console.log('SelectedITem:', id);
      const alreadySelected = selectedItems.findIndex(item => item === id) 

       if(alreadySelected >= 0) {


         const filteredItems = selectedItems.filter(item => item !== id)
          setSelectedItems(filteredItems)
         
        } else {

          setSelectedItems([ ...selectedItems, id])

      }

    }

    async function handleSubmit(formEvent: FormEvent) {
      //Console test:
      console.log('Form Event:', formEvent);

        formEvent.preventDefault()

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [ latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items' , items.join(','));

        // Condição que adiciona a imagem se o campo tiver sido informado, ou seja, se existir imagem:
        if (selectedFile) {
            data.append('image', selectedFile)
        } 
 

        await api.post('points', data);

        alert("Ponto de coleta criado!!");

        history.push('/');

    }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft></FiArrowLeft>
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta.
        </h1>

        <Dropzone onFileUploaded={setSelectedFile}/>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange}/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" id="email" onChange={handleInputChange}/>
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
             <Marker position={selectedPosition} />  

          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>

                <option value="0" hidden>Selecione uma UF</option>

                {ufs.map(uf => (

                    <option value={uf} key={uf}>{uf}</option>

                ))}

              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>

              <select name="city" id="city" onChange={handleSelectCity}>

                <option value="0" hidden>Selecione uma Cidade</option>

                {cities.map(city => (
                    <option value={city} key={city}>{city}</option>
                ))}

              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais intens abaixo</span>
          </legend>

          <div className="items-grid">

            {items.map(item => (//percorro os items e faço um retorno.

            <li
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
            >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>

            ))}

          </div>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
