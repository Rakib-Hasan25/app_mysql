import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { createNote,getAllNotes,deleteNotesById, updateNotesById } from './controllers/notes.controllers.js';
import { getcontainers,uploadingBlob,readBlob,uploadfiles } from './lib/blobservice.js';
import {upload} from "./middleware/multer.middleware.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true, limit:"16kb" }))
app.use(cors({
    origin : "*",
    credentials:true
}))

app.get('/', (req, res) => {
    res.json({
        msg :"success"
    })
})


app.post('/create-note',createNote)
app.get('/get-all-note',getAllNotes)
app.delete('/delete-note/:id',deleteNotesById)
app.patch('/update-note/:id',updateNotesById)

app.get('/api/containers',getcontainers )
// app.post('/api/blob', uploadingBlob)
app.get('/api/blob/:containerName/:blobName',readBlob)
app.post('/api/blob',upload.single("avatar"),uploadfiles)
app.listen(8080, (req, res) => {
    console.log(`listening on port ${process.env.PORT} `)
})