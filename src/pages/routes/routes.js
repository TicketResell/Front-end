import HeaderOnly from '../../layouts/HeaderOnly';
import Profile from '../Profile';
import Register from '../Register';
import Login from '../Login';
import Home from '../Home';
import UpdateProfile from '../UpdateProfile';
import ForgotPassword from '../ForgotPassword';
import AboutUs from '../AboutUs';
import Payment from '../Payment';
import Admin from '../Admin';
import CustomerLayout from '../Customer/Layout';
import TicketDetail from '../TicketDetail';

const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
    {path: '/aboutUs',component: AboutUs, layout: null},
    {path: '/admin',component: Admin, layout: null},
    {path: '/ticketDetail',component: TicketDetail},
];

const privateRoutes = [
    { path: '/profile', component: Profile},
    { path: '/updateProfile', component: UpdateProfile},
    { path: '/forgotPassword', component: ForgotPassword, layout: null},
    { path: '/payment', component: Payment, layout: HeaderOnly},
    { path: '/customer', component: CustomerLayout,layout : null},
];

export { publicRoutes, privateRoutes };