import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon
import styles from './Profile.module.scss';
import api from '../../config';

const Profile = ({user}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        gender: "",
        address: ""
    });
    const [imageSrc, setImageSrc] = useState(""); // State for image source
    const [imageUploaded, setImageUploaded] = useState(false); // State to track image upload

    const fileInputRef = useRef(null);

    // Memoize the fetchProfile function using useCallback
    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get(`accounts/profile/${user.sub}`)
            if (response.status === 200) {
                setFormData({
                    fullname: response.data.fullname,
                    phone: response.data.phone,
                    email: response.data.email,
                    gender: response.data.gender,
                    address: response.data.address,
                });
                setImageSrc(response.data.profileImage || "https://via.placeholder.com/150");
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    // API call to fetch profile based on role
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]); // Now fetchProfile is in the dependency array

    const handleUpdateProfile = () => {
        if (isEditing) {
            // Logic to save updated data (API call to update)
            const updateProfile = async () => {
                try {
                    const response = await api.put(`accounts/profile/${user.sub}`)
                    if (response) {
                        setIsEditing(false);
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                }
            };

            updateProfile();
        } else {
            setIsEditing(true);
            setImageUploaded(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setImageUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangeImage = () => {
        setImageUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={styles.profilePage}>
            <main>
                <div className={styles.profileContainer}>
                    <div className={styles.uploadSection}>
                        <div className={styles.imageContainer}>
                            <img
                                src={imageSrc || "https://via.placeholder.com/150"}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                            {isEditing && !imageUploaded && (
                                <label htmlFor="image-upload" className={styles.cameraIcon} onClick={handleChangeImage}>
                                    <FaCamera />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className={styles.uploadImage}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}
                        </div>
                        {imageUploaded && isEditing && (
                            <button className={styles.changeImageButton} onClick={handleChangeImage}>
                                Thay đổi hình ảnh
                            </button>
                        )}
                    </div>

                    <div className={styles.contactInfo}>
                        <h2>{isEditing ? "Cập nhật thông tin" : "Thông tin liên hệ"}</h2>
                        <form>
                            <label>
                                Họ và tên:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Điện thoại:
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Giới tính:
                                <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Địa chỉ:
                                <textarea
                                    name="address"
                                    onChange={handleInputChange}
                                    value={formData.address}
                                    readOnly={!isEditing}
                                />
                            </label>
                        </form>

                        <button className={styles.updateButton} onClick={handleUpdateProfile}>
                            {isEditing ? "Lưu thông tin" : "Cập nhật thông tin"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
