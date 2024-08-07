import Message from '@/models/Message';
import dbConnect from '@/utils/dbConnect';

export async function GET(req, res) {
    try {
        await dbConnect(); // Ensure database connection

        // Fetch all messages from the database
        const messages = await Message.find({}).sort({ createdAt: 1 });

        console.log('Fetched messages:', messages); // Log fetched messages for debugging

        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error); // Log error details
        return new Response(JSON.stringify({ message: "Something went wrong" }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
    }
}
