const mongoose = require('mongoose');

const connectDatabase = async () => {
    try
    {
        await mongoose.connect(process.env.MongoDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB is connected to the host: ${mongoose.connection.host}`);
    }
    catch (error)
    {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDatabase;
