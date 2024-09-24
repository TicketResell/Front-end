import HeaderOnly  from '../../layouts/HeaderOnly';
import Register from '../Register';
import Login from '../Login';
import Home from '../Home';
import AboutUs from '../AboutUs';
import Payment from '../Payment';

const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: HeaderOnly },
    { path: '/login', component: Login, layout: null },
    {path: '/aboutUs',component: AboutUs, layout: null}
];

const privateRoutes = [
    { path: '/payment', component: Payment, layout: HeaderOnly}
];

export { publicRoutes, privateRoutes };