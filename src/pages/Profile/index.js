import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Footer from '../../layouts/components/Footer';
import styles from './Profile.module.scss';

const Profile = () => {
    const navigate = useNavigate(); // Hook for navigation

    const handleUpdateProfile = () => {
        navigate('/updateprofile'); // Navigate to the update profile page
    };

    return (
        <div className={styles.profilePage}>
            {/* Main Content Section */}
            <main>
                <div className={styles.profileContainer}>
                    {/* Upload Image Section (Only Viewing) */}
                    <div className={styles.uploadSection}>
                        <div className={styles.imageContainer}>
                            <img
                                src="https://via.placeholder.com/150"  // URL của ảnh đại diện
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className={styles.contactInfo}>
                        <h2>Thông tin liên hệ</h2>
                        <form>
                            <label>
                                Họ và tên:
                                <input type="text" value="Nguyễn Văn A" readOnly />
                            </label>
                            <label>
                                Điện thoại:
                                <input type="text" value="0903500680" readOnly />
                            </label>
                            <label>
                                Email:
                                <input type="email" value="nguyenvana@gmail.com" readOnly />
                            </label>
                            <label>
                                Ngày sinh:
                                <input type="date" value="1993-08-09" readOnly />
                            </label>
                            <label>
                                Giới tính:
                                <input type="text" value="Nam" readOnly />
                            </label>
                            <label>
                                Địa chỉ:
                                <textarea readOnly>
                                    Lô E2a-7, Đường D1, Khu Công nghệ cao P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.
                                </textarea>
                            </label>
                        </form>
                        
                        {/* Update Button */}
                        <button className={styles.updateButton} onClick={handleUpdateProfile}>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <Footer />
        </div>
    );
};

export default Profile;
