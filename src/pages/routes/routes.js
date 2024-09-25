import HeaderOnly from '../../layouts/HeaderOnly';
import Profile from '../Profile'
import Register from '../Register';
import Login from '../Login';
import Home from '../Home';
import Footer from '../../layouts/components/Footer'
import UpdateProfile from '../UpdateProfile';
import ForgotPassword from '../ForgotPassword';

const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/profile', component: Profile, layout: HeaderOnly},
    { path: '/footer', component: Footer, layout: null},
    { path: '/updateProfile', component: UpdateProfile, layout: HeaderOnly},
    { path: '/forgot-password', component: ForgotPassword, layout: null},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };