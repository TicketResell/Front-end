import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCamera } from 'react-icons/fa';
import styles from './Profile.module.scss';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Import Modal và Button từ react-bootstrap

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        address: "",
        userImage: "",
    });
    const [imageSrc, setImageSrc] = useState("https://via.placeholder.com/150");
    const [imageUploaded, setImageUploaded] = useState(false);
    const apiKey = "a393ae4d99828767ecd403ef4539e170";
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false); // State để quản lý modal
    const [modalMessage, setModalMessage] = useState(""); // State để lưu thông điệp modal

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            console.log("Bố ở đây nè con", storedUser);
        }
    }, []);

    const fetchProfile = useCallback(async () => {
        if (!user || !user.sub) {
            console.error("User or sub not found.");
            return;
        }

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
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const validatePhone = (phone) => {
        // Mẫu regex kiểm tra số điện thoại Việt Nam hợp lệ (10 chữ số và đầu số hợp lệ)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    const handleUpdateProfile = async () => {
        if (isEditing) {
            // Kiểm tra xem số điện thoại có hợp lệ không
            if (!validatePhone(formData.phone)) {
                setModalMessage("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam.");
                setModalShow(true); // Hiển thị modal
                return;
            }
    
            // Kiểm tra các trường còn lại nếu cần
            const isEmptyField = Object.values(formData).some(value => (value || "").trim() === "");
        
            if (isEmptyField) {
                setModalMessage("Vui lòng điền tất cả các trường.");
                setModalShow(true);
                return;
            }
        
            try {
                const response = await api.put(`accounts/profile/${user.sub}`, {
                    ...formData,
                    userImage: imageSrc,
                });
    
                if (response.status === 200) {
                    setModalMessage("Cập nhật hồ sơ thành công!");
                    setModalShow(true);
                    setTimeout(() => {
                        navigate("/"); // Điều hướng về trang chính sau 2 giây
                    }, 2000);
    
                    setIsEditing(false);
                } else {
                    setModalMessage("Cập nhật hồ sơ không thành công.");
                    setModalShow(true);
                }
            } catch (error) {
                console.error("Error updating profile:", error.response ? error.response.data : error.message);
                setModalMessage("Có lỗi xảy ra khi cập nhật hồ sơ.");
                setModalShow(true);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            setIsLoading(true);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data && data.data && data.data.url) {
                    setImageSrc(data.data.url);
                    setFormData((prevFormData) => ({ ...prevFormData, userImage: data.data.url }));
                    setImageUploaded(true);
                } else {
                    console.error('Không thể tải ảnh lên imgBB');
                }
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên imgBB:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChangeImage = () => {
        setImageUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Hàm để đóng modal
    const handleCloseModal = () => setModalShow(false);

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
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                isEditing && !imageUploaded && (
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
                                )
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

                {/* Modal để hiển thị thông báo */}
                <Modal show={modalShow} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thông báo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default Profile; 