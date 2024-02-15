import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    user_idM:{
        type: String,
    },
    name: {
        type: String,
    },
    rating: {
        type: Number,
    }
   
})

export default mongoose.model('Movie', movieSchema)