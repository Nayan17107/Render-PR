const express = require('express')
const { addAdminPage, addAdmin, viewAdminPage, deleteAdmin, editAdminPage, updateAdmin } = require('../Controller/admin.controller')
const upload = require('../Middleware/ImageUpload')
const route = express.Router()

route.get('/add-admin', addAdminPage)

route.post('/add-admin', upload.single('profileImage'), addAdmin)

route.get('/view-admin', viewAdminPage)

route.get('/delete-admin/:id', deleteAdmin)

route.get('/edit-admin/:id', editAdminPage)

route.post('/update-admin/:id', upload.single('profileImage'), updateAdmin)

module.exports = route