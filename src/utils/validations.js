export const validateEmail = (val) => {
    if (!val) return 'O email é obrigatório.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Por favor, insira um email válido.';
};

export const validatePassword = (val) => {
    if (!val) return 'A senha é obrigatória.';
    // return val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres.';
};

export const validateTitle = (val) => {
    if (!val) return 'O título é obrigatório.';
    // return val.length <= 20 || 'O título deve ter no máximo 20 caracteres.';
};

export const validateDescription = (val) => {
    if (!val) return 'A descrição é obrigatório.';
    // return val.length <= 90 || 'A descrição deve ter no máximo 90 caracteres.';
};
