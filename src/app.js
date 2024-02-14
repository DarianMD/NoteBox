import express from 'express'
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'
import movieRoutes from './routes/movie.routes.js'


const app = express()

app.use(morgan('dev'))
app.use(express.json())


app.use('/api',movieRoutes)
app.use('/api',authRoutes)


export default app