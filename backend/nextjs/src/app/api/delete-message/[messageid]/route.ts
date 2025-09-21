import UserModel from '@/models/User';
import { getUserFromSession } from '@/utils/getSessions';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const {messageid : messageId} = await params;
  await dbConnect();
  const getUser = await getUserFromSession()
          if(!getUser.success){
              return getUser.response
          }
          const user = getUser.data as User
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}