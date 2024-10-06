import React, { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon
import styles from './Profile.module.scss';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "Nguyễn Văn A",
        phone: "0903500680",
        email: "nguyenvana@gmail.com",
        birthDate: "1993-08-09",
        gender: "Nam",
        address: "Lô E2a-7, Đường D1, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM."
    });
    const [imageSrc, setImageSrc] = useState(""); // State for image source
    const [imageUploaded, setImageUploaded] = useState(false); // State to track image upload

    // Tạo ref cho input file
    const fileInputRef = useRef(null);

    const handleUpdateProfile = () => {
        if (isEditing) {
            // Logic to save updated data (if necessary)
            setIsEditing(false);
        } else {
            setIsEditing(true);
            setImageUploaded(false); // Reset the imageUploaded state when editing is toggled on
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
                setImageSrc(reader.result); // Set the image source to the data URL
                setImageUploaded(true); // Mark image as uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangeImage = () => {
        setImageUploaded(false); // Allow user to upload a new image
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
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
                            {isEditing && !imageUploaded && ( // Hiện icon camera khi ở chế độ chỉnh sửa và chưa upload hình
                                <label htmlFor="image-upload" className={styles.cameraIcon} onClick={handleChangeImage}>
                                    <FaCamera />
                                    <input
                                        type="file"
                                        ref={fileInputRef} // Sử dụng ref
                                        className={styles.uploadImage}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }} // Ẩn input mặc định
                                    />
                                </label>
                            )}
                        </div>
                        {/* Button to change image after uploading */}
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
                                    value={formData.fullName}
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
                                Ngày sinh:
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
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