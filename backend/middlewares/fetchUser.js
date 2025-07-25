const jwt = require('jsonwebtoken');
const connection = require('../db');
const JWT_SECRET = process.env.SECRET_KEY;

// Function to authenticate user using JWT token
const fetchUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "auth token not found!" 
            });
        }

        const data = jwt.verify(token, JWT_SECRET);
        
        connection.query("SELECT * FROM user where id = ?", [data.user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: "Database error", 
                    error: err.message 
                });
            }

            if (results.length !== 0) {
                req.user = {
                    id: results[0].id,
                    type: results[0].type
                };
                next();
            } else {
                return res.status(404).json({ 
                    success: false, 
                    message: "user not found!" 
                });
            }
        });

    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token", 
            error: error.message 
        });
    }
}

module.exports = fetchUser;