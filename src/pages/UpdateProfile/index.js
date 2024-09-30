import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import styles from './updateProfile.module.scss';

const UpdateProfile = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        name: 'Nguyễn Văn A',
        phone: '0903500680',
        email: 'nguyenvana@gmail.com',
        dob: '1993-08-09',
        gender: 'Nam',
        address: 'Lô E2a-7, Đường D1, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.',
        profileImage: null // State for image upload
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                profileImage: URL.createObjectURL(file) // Create a URL for the uploaded image
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Data:', formData);
        // You can make an API call to save the updated profile data here

        navigate('/profile');
    };

    return (
        <div className={styles.updateProfilePage}>
            <main>
                <div className={styles.profileContainer}>
                    {/* Upload Image Section */}
                    <div className={styles.uploadSection}>
                        {/* Use a label to trigger the file input when the icon is clicked */}
                        <label className={styles.imageLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.imageInput}
                                style={{ display: 'none' }} // Hide the input visually
                            />
                            <div className={styles.imageContainer}>
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className={styles.profileImage} />
                                ) : (
                                    <i className={`fa fa-camera ${styles.cameraIcon}`} />
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Update Info Section */}
                    <div className={styles.contactInfo}>
                        <h2>Cập nhật thông tin</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Họ và tên:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Điện thoại:
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Ngày sinh:
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Giới tính:
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Bí mật">Bí mật</option>
                                </select>
                            </label>
                            <label>
                                Địa chỉ:
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <button type="submit" className={styles.saveButton}>
                                Lưu thông tin
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpdateProfile;
