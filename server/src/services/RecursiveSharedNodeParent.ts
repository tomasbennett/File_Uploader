import { Prisma, SharedNode } from "@prisma/client";
import { prisma } from "../db/prisma";



type ISharedNodeWithFolder = Prisma.SharedNodeGetPayload<{
    select: {
        id: true,
        parentNodeId: true,
        folder: true
    }
}>;

export async function recursiveSharedNodeParent(
    startSharedNodeId: string | null,
    sessionId: string
): Promise<ISharedNodeWithFolder[] | Error> {
    const ancestors: ISharedNodeWithFolder[] = [];

    if (!startSharedNodeId) {
        return ancestors;
    }


    try {
        let current = await prisma.sharedNode.findUnique({
            where: { id: startSharedNodeId },
            select: { id: true, parentNodeId: true, folder: true },
            // include: { folder: true }
        });

        while (current) {
            ancestors.push(current);

            if (!current.parentNodeId) break;
    
            current = await prisma.sharedNode.findFirst({
                where: {
                    id: current.parentNodeId,
                    sharedRelationshipId: sessionId
                },
                select: { id: true, parentNodeId: true, folder: true }
            });
        }
    
        return ancestors;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error retrieving shared node parents:', error.message);
            return error;
        }


        return new Error('Database error occurred while retrieving shared node parents!!!');

    }

}
