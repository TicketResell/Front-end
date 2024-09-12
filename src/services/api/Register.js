export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhone = (phone) => {
    const regex = /^0[0-9]{9}$/; // Format VN, bắt đầu bằng 0 và 10 số
    return regex.test(phone);
};
