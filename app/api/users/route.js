import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";




export async function GET(req, res) {
    await dbConnect();

    try {

        const userList = await User.find({});

        console.log('userList:', userList);
        return new Response(JSON.stringify(userList), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
