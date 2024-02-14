import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    rating: {
        type: Number
    }
   
})

export default mongoose.model('Movie', movieSchema)