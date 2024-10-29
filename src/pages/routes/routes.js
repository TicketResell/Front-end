import HeaderOnly from '../../layouts/HeaderOnly';
import Profile from '../Profile';
import Register from '../Register';
import Login from '../Login';
import Home from '../Home';
import UpdateProfile from '../UpdateProfile';
import ForgotPassword from '../ForgotPassword';
import AboutUs from '../AboutUs';
import Payment from '../Payment';
import Admin from '../Admin/AdminOverview';
import CustomerLayout from '../Customer/Layout';
import OrderPage from '../Order';
import StaffLayout from '../Staff/Layout';
import TicketDetail from '../TicketDetail';
import ErrorPage from '../ErrorPage';
import SellerPage from '../Seller Page';
import Shipper from '../Shipper';


const publicRoutes = [
    { path: '/', component: Home},
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/order', component: OrderPage, layout: null },
    {path: '/aboutUs',component: AboutUs, layout: null},
    {path: '/ticketDetail/:userId/:ticketId/:eventTitle',component: TicketDetail},
    {path: '/errorPage',component: ErrorPage, layout: null},
    {path: '/sellerPage',component: SellerPage},
];

const privateRoutes = [
    { path: '/profile', component: Profile},
    { path: '/updateProfile', component: UpdateProfile},
    { path: '/forgot-password', component: ForgotPassword, layout: null},
    { path: '/payment', component: Payment, layout: HeaderOnly, role: 'user'},
    { path: '/customer', component: CustomerLayout,layout : null, role: 'user'},
    { path: '/admin',component: Admin, layout: null, role: 'admin'},
    { path: '/shipper',component: Shipper, layout: null, role: 'shipper'},
    { path: '/staff',component: StaffLayout, layout: null, role: 'staff'},
];

export { publicRoutes, privateRoutes };