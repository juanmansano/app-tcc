import axios from 'axios';

const api = axios.create({
    baseURL: 'http://dvrmansano.ddns.net:5210'
})

export { api };