import express from "express"
import { createAdmin, deleteAdmin, loginAdmin, readAdmin, updateAdmin } from "../controller/adminController"
import { verifyAdmin } from "../middleware/verifyAdmin"

const app = express()
app.use(express.json())

app.post(`/admin`, verifyAdmin, createAdmin)
app.get(`/admin`, verifyAdmin, readAdmin)
app.put(`/admin/:adminID`, verifyAdmin, updateAdmin)
app.delete(`/admin/:adminID`, verifyAdmin, deleteAdmin)
app.post(`/admin/login`, loginAdmin)

export default app