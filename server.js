// Lets the server use express
const response = require('express')
const express = require('express')

// Lets the server use all the method included in express
const app = express()

// Lets the user fetch the API from localhost
const cors = require('cors')

const fs = require('fs')

const path = require("path")

const PORT = 8000

let foodCache = []

const loadAllFoods = () => {
    const rootDir = path.join(__dirname, 'api')
    
    foodCache = [] 

    const getFilesRecursively = (directory) => {
        const filesInDirectory = fs.readdirSync(directory, { withFileTypes: true })
        
        filesInDirectory.forEach(file => {
            const absolutePath = path.join(directory, file.name)
            if (file.isDirectory()) {
                getFilesRecursively(absolutePath)
            } else if (path.extname(file.name) === '.json') {
                const fileData = fs.readFileSync(absolutePath, 'utf-8')
                
                foodCache.push(JSON.parse(fileData))
            }
        })
    }
    
    getFilesRecursively(rootDir)
}

loadAllFoods()

// ==========   
// MIDDLEWARE
// ==========
app.use(cors())

// ==========
// HANDLERS
// ==========
app.get('/', (request, response) => {
    // Respond with what?
    // We want to send a file back
    // Look for the file on the same path where server.js is and start looking for index.html there
    response.sendFile(__dirname + '/index.html')
})

// GET: Request for all food
app.get('/api/foods', (request, response) => {
    response.json(foodCache)
})

// GET: Request for specific food
app.get('/api/foods/:foodName', (request, response) => {
    const requestedName = request.params.foodName.toLowerCase()
    
    const formattedName = requestedName.replace(/-/g, ' ')

    const foundFood = foodCache.find(food => food.name.toLowerCase() === formattedName)

    if (foundFood) {
        response.json(foundFood)
    } else {
        response.status(404).json({ error: "Food not found" })
    }
})

// LISTEN: on PORT 8000
app.listen(process.env.PORT || PORT, () => {
    console.log(`SERVER STATUS: RUNNING on PORT ${PORT}`);
})