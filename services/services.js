export const success = (response) => {
    if (response) {
        return { success: true, data: response };
    }
    return { success: true };
};

export const fail = (response) => {
    if (response) {
        return { success: false, message: response };
    }
    return { success: false };
};
