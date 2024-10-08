export const confirmEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const confirmPhone = (phone) => {
    const regex = /^0[0-9]{9}$/; 
    return regex.test(phone);
};

export const confirmUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{5,20}$/;
    return regex.test(username);
};
