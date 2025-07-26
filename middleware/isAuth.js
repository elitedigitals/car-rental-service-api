import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
 
    try {
       const authHeader = req.headers.authorization;
       if (!authHeader ) {
           return res.status(401).json({ message: "Unauthorized access" });
       } 
       const token = authHeader.split(' ')[1];
       if (!token) {
           return res.status(401).json({ message: "Unauthorized access" });
       }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       if (!decoded) {
           return res.status(401).json({ message: "Unauthorized access" });
       }
       req.user = decoded;
       next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
        
    }
}
