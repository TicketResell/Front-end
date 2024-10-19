import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon
import styles from './Profile.module.scss';
import api from '../../config/axios';

const Profile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        address: "",
        userImage: "",
    });
    const [imageSrc, setImageSrc] = useState(""); // State for image source
    const [imageUploaded, setImageUploaded] = useState(false); // State to track image upload
    const apiKey = "a393ae4d99828767ecd403ef4539e170"; // API Key cho imgbb
    const fileInputRef = useRef(null);

    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get(`accounts/profile/${user.sub}`);
            if (response.status === 200) {
                setFormData({
                    fullname: response.data.fullname,
                    phone: response.data.phone,
                    email: response.data.email,
                    address: response.data.address,
                    userImage: response.data.userImage || "",
                });
                setImageSrc(response.data.userImage || "https://via.placeholder.com/150");
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, [user.sub]);

    // Fetch profile on component mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdateProfile = async () => {
        if (isEditing) {
            // Cập nhật profile với thông tin và ảnh mới (URL từ imgBB)
            try {
                // Log data being sent
                console.log("Updating profile with data:", {
                    ...formData,
                    userImage: imageSrc, // Ensure imageSrc is used here
                });
                const response = await api.put(`accounts/profile/${user.sub}`, {
                    ...formData,
                    userImage: imageSrc, // Sử dụng URL đã lưu trong imageSrc
                });

                if (response.status === 200) {
                    setIsEditing(false);
                    console.log("Profile updated successfully.");
                } else {
                    console.error("Failed to update profile. Status:", response.status);
                }
            } catch (error) {
                console.error("Error updating profile:", error.response ? error.response.data : error.message);
            }
        } else {
            setIsEditing(true);
            setImageUploaded(false);
        }
    };

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }, []);

    // Handle Image Upload with imgBB
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data && data.data && data.data.url) {
                    setImageSrc(data.data.url); // Sử dụng URL ảnh từ imgBB
                    setFormData((prevFormData) => ({ ...prevFormData, userImage: data.data.url })); // Update formData with new image URL
                    setImageUploaded(true); // Đánh dấu đã upload ảnh
                } else {
                    console.error('Không thể tải ảnh lên imgBB');
                }
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên imgBB:', error);
            }
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
                                    name="fullname"
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
