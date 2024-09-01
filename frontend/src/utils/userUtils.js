export const getUserIdPrefix = (userId) => {
    return userId ? userId.substring(0, 8) : 'Anonymous';
};