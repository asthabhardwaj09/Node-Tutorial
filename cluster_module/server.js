const cluster = require('cluster');
const express = require("express")
const os = require('os')


const totalCPU = os.cpus().length;

if (cluster.isPrimary) {
    //   console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < totalCPU; i++) {
        cluster.fork();
    }

}
else {
    const app = express()
    const PORT = 8000

    app.get('/', (req, res) => {
        return res.json({ message: `Hello from Express Server ${process.pid}` })
    })

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on PORT ${PORT}`)
    })
}

// console.log("My total CPU is ",totalCPU)