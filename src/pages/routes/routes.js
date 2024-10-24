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
import Order from '../Order';
import StaffLayout from '../Staff/Layout';
import TicketManage from '../Staff/TicketManage'
import TicketDetail from '../TicketDetail';


const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/order', component: Order, layout: null },
    {path: '/aboutUs',component: AboutUs, layout: null},
    {path: '/ticketDetail/:userId/:ticketId/:eventTitle',component: TicketDetail},
];

const privateRoutes = [
    { path: '/profile', component: Profile},
    { path: '/updateProfile', component: UpdateProfile},
    { path: '/forgot-password', component: ForgotPassword, layout: null},
    { path: '/payment', component: Payment, layout: HeaderOnly},
    {path: '/admin',component: Admin, layout: null},
    { path: '/customer', component: CustomerLayout,layout : null},
    { path: '/admin',component: Admin, layout: null},
    { path: '/staff',component: StaffLayout, layout: null},
    { path: '/ticketManage',component: TicketManage, layout: null},
];

export { publicRoutes, privateRoutes };