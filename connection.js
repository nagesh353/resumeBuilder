const mongoose = require('mongoose');

class MongoConnection {
    constructor() {
        if (!MongoConnection.instance) {
            this.connect();
            MongoConnection.instance = this;

        }
        return MongoConnection.instance;
    }

    connect() {
        mongoose.connect('mongodb://localhost:27017/resume',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('MongoDB connected');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
        });
    }
}

// Static property to hold the single instance
MongoConnection.instance = null;

module.exports =  new MongoConnection;
