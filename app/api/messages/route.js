import Message from '@/models/Message';
import dbConnect from '@/utils/dbConnect';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await dbConnect(); // Ensure database connection

            // Fetch all messages from the database
            const messages = await Message.find({}).sort({ createdAt: 1 });

            console.log('Fetched messages:', messages); // Log fetched messages for debugging

            // Set cache control headers to prevent caching
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Surrogate-Control', 'no-store');

            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error); // Log error details

            // Set cache control headers to prevent caching
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Surrogate-Control', 'no-store');

            res.status(500).json({ message: "Something went wrong" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
