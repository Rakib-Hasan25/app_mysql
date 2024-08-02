import {pool} from "../db/dbconnection.js"

const createNote = async (req,res)=>{
    const {title,content} = req.body;
    const result =await pool.query(`
        insert into notes 
        (title,content)
        values (?,?)
        `,[title,content])

        const insertNoteId = result[0].insertId
        const insertedNote = await pool.query(`select * from notes where notes_id = ?`,[insertNoteId])
        console.log(result[0].insertId);
        return res
        .status(201)
        .json({
            data:insertedNote[0],
            success:"notes created successfully"
        })
}

const getAllNotes = async (req,res)=>{
    
    const notes = await pool.query(`select * from notes `)

        return res
        .status(201)
        .json({
            data : notes[0],
            success:"notes created successfully"
        })
}


const deleteNotesById =   async (req,res)=>{
    const {id} = req.params;
    const notes = await pool.query(`delete from notes where notes_id = ? `,[id])
    console.log(notes)    
    return res
        .status(201)
        .json({
            data : [],
            success:"notes deleted successfully"
        })
}

const updateNotesById = async (req,res)=>{
    const {id} = req.params;
    const {title,content}= req.body;

    let sql = `
    update notes 
    set title = ?, content = ?
    where notes_id = ?
    `
    const result = await pool.query(sql,[title,content,id])

    console.log(result)

    const updatedNote = await pool.query(`select * from notes where notes_id = ?`,[id])
       
    return res
    .status(201)
    .json({
        data : updatedNote[0],
        success:"notes updated successfully"
    })
}

export {createNote,getAllNotes,deleteNotesById,updateNotesById} 