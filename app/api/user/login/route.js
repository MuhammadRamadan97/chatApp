import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';

export async function POST(req, res) {
    await dbConnect();

    try {
        const { username, password } = await req.json();

        const user = await User.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 400 });
        }

        const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return new Response(JSON.stringify({ result: user, token }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
