
import Message from '@/models/Message';
import dbConnect from '@/utils/dbConnect';

export async function GET(req, res) {
    await dbConnect();

    try {

        const messages = await Message.find({});


        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
