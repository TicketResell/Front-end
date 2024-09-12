import { HeaderOnly } from '../../layouts/HeaderOnly';
import Register from '../Register';
import Login from '../Login';
import Home from '../Home';

const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };