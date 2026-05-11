const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.sync({ force: false }); // À changer avec précaution pour le développement si nécessaire
        console.log('Database connected & synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Impossible de connecter à la base de données :', error);
    }
}

startServer();
