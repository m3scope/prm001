module.exports = {
    // Загрузить модель юзера (пользователя)
    // На *nix-ах все файлы чувствительны к регистру
    User: require('./user'),
    Transaction: require('./transaction'),
    Deal: require('./deal'),
    Bill: require('./bill')
};
// Не забудем точку с запятой!