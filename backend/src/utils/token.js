import jwt from 'jsonwebtoken';

export function generateToken(id) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return token;
};

export function verifyToken(token) {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    return verifyToken;
}