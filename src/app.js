import express from 'express'
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'
import mediaRoutes from './routes/media.routes.js'


const app = express()

app.use(morgan('dev'))
app.use(express.json())


app.use('/api',mediaRoutes)
app.use('/api',authRoutes)


export default app