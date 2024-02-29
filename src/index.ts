/*ini adalah file utama untuk menjalankan server backend */ 
/** import library express */ 
import express, { Request, Response } from "express"; 
import adminRoute from "./route/adminRoute"
import carRoute from "./route/carRoute"
import rentRoute from "./route/rentRoute"
/**buat wadah inisiasi express */ 
const app = express(); 
/** mendefinisikan PORT berjalannya server */ 
const PORT = 8010; 
/** proses pertama untuk handle request */
app.get(`/prvte`, (request: Request, response: Response) => {
    /**
     * ini adalah proses handle request dengan
     * url/address: http://localhost:8000/serena
     * method: GET
     */
    /** memberi response */
    return response.status(200).json({
        message: `Hello my Master, welcome back..! `
    })
})

app.use(adminRoute)
app.use(carRoute)
app.use(rentRoute)

/** run server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})