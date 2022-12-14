const express = require('express');
const Notes = require('../models/Notes')
const router = express.Router();
var fetchuser = require('../controller/fetchuser.js')
const { body, validationResult } = require('express-validator');



router.get('/note', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})


router.post('/note', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter description of minimum 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors , return bad request and the errors
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await notes.save()
        res.json(savednote)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})


router.put('/note/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a newNote object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        // find the note to be updated and update it
        let notes = await Notes.findById(req.params.id);
        if (!notes) { return res.status(404).send("Not Found") }
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ notes });
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})


router.delete('/note/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // find the note to be deleted and delete it
        let notes = await Notes.findById(req.params.id);
        if (!notes) { return res.status(404).send("Not Found") }
        // allow deletion only if user owns this note
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        notes = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "notes have been deleted", notes: notes });
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})
module.exports = router;