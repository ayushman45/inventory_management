
import { config } from "../config";
import { connect } from 'mongoose';

connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("DB connection established");
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

