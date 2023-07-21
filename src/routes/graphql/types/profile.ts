import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberTypeId, memberType } from "./member.js";
import { PrismaType } from "./prisma.js";

export const profileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: UUIDType! },
    isMale: { type: GraphQLBoolean! },
    yearOfBirth: { type: GraphQLInt! },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: memberType,
      async resolve({ memberTypeId }: { memberTypeId: string }, args, prisma: PrismaType) {  
        return await prisma.memberType.findUnique({
          where: {
            id: memberTypeId,
          },
        });
      },
    },
  }),
});
