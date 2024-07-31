
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export async function POST(req, res) {
    await dbConnect();

    try {
        const { username, password } = await req.json();

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ username: result.username, id: result._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return new Response(JSON.stringify({ result, token }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
