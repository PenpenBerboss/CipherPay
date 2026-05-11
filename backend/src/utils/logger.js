exports.log = (message, level = 'info') => {
    console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}`);
};
