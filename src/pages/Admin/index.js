import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Footer from '../../layouts/components/Footer';
import NavigationBar from '../../layouts/components/NavBar';
import { Bar, Line, Pie } from 'react-chartjs-2'; // Import the necessary chart types
import styles from './Admin.module.scss';

const Admin = () => {
    const navigate = useNavigate(); // Hook for navigation

    const users = [
        { id: 1, name: 'Nguyễn Văn A', phone: '0903500680', email: 'nguyenvana@gmail.com', birthdate: '1993-08-09', gender: 'Nam', address: 'Lô E2a-7, Đường D1, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 2, name: 'Trần Thị B', phone: '0903500681', email: 'tranthib@gmail.com', birthdate: '1995-09-12', gender: 'Nữ', address: 'Lô E2a-8, Đường D2, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 3, name: 'Lê Văn C', phone: '0903500682', email: 'levanc@gmail.com', birthdate: '1992-07-15', gender: 'Nam', address: 'Lô E2a-9, Đường D3, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 4, name: 'Phạm Văn D', phone: '0903500683', email: 'phamvand@gmail.com', birthdate: '1991-06-22', gender: 'Nam', address: 'Lô E2a-10, Đường D4, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 5, name: 'Đỗ Thị E', phone: '0903500684', email: 'dothie@gmail.com', birthdate: '1990-05-18', gender: 'Nữ', address: 'Lô E2a-11, Đường D5, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 6, name: 'Ngô Văn F', phone: '0903500685', email: 'ngovanf@gmail.com', birthdate: '1994-04-10', gender: 'Nam', address: 'Lô E2a-12, Đường D6, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 7, name: 'Võ Thị G', phone: '0903500686', email: 'vothig@gmail.com', birthdate: '1996-03-25', gender: 'Nữ', address: 'Lô E2a-13, Đường D7, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 8, name: 'Bùi Văn H', phone: '0903500687', email: 'buivanh@gmail.com', birthdate: '1989-02-14', gender: 'Nam', address: 'Lô E2a-14, Đường D8, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 9, name: 'Nguyễn Thị I', phone: '0903500688', email: 'nguyenthii@gmail.com', birthdate: '1997-01-30', gender: 'Nữ', address: 'Lô E2a-15, Đường D9, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
        { id: 10, name: 'Lê Văn J', phone: '0903500689', email: 'levanj@gmail.com', birthdate: '1992-12-11', gender: 'Nam', address: 'Lô E2a-16, Đường D10, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.' },
    ];

    const handleUpdateProfile = () => {
        navigate('/updateprofile'); // Navigate to the update profile page
    };

    const handleEditUser = (id) => {
        // Handle user edit
        console.log(`Edit user with ID: ${id}`);
    };

    const handleDeleteUser = (id) => {
        // Handle user delete
        console.log(`Delete user with ID: ${id}`);
    };

    // Count males and females for the gender chart
    const maleCount = users.filter(user => user.gender === 'Nam').length;
    const femaleCount = users.filter(user => user.gender === 'Nữ').length;

    const genderChartData = {
        labels: ['Nam', 'Nữ'],
        datasets: [
            {
                data: [maleCount, femaleCount],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartData1 = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Doanh thu',
                data: [65, 59, 80, 81, 56],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartData2 = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,  // Make the charts responsive
        maintainAspectRatio: false,  // Allow changing size based on container
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className={styles.adminPage}>
            <main className="container">
                <h1 className="mt-4">Trang Quản Trị</h1>

                {/* Biểu đồ */}
                <div className="row">
                    <div className="col-md-4">
                        <h3>Doanh thu tháng</h3>
                        <div style={{ height: '300px' }}>
                            <Line data={chartData1} options={chartOptions} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3>Bình chọn</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={chartData2} options={chartOptions} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3>Biểu đồ giới tính</h3>
                        <div style={{ height: '300px' }}>
                            <Pie data={genderChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Bảng người dùng */}
                <h2 className="mt-4">Danh sách người dùng</h2>
                <table className="table table-striped table-hover table-bordered mt-4">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.birthdate}</td>
                                <td>{user.gender}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditUser(user.id)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Admin;
