import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId, memberType } from './types/member.js';
import { postType } from './types/post.js';
import { profileType } from './types/profile.js';
import { userType } from './types/user.js';
import { PrismaType } from './types/prisma.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    memberType: {
      type: memberType,
      args: {
        id: { type: MemberTypeId! },
      },
      async resolve(source, { id }: {id: string}, prisma: PrismaType) {
        return await prisma.memberType.findUnique({ where: { id } });
      }
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.memberType.findMany()
      }
    },
    post: {
      type: postType,
      args: {
        id: { type: UUIDType },
      },
      async resolve(source, { id }: {id: string}, prisma: PrismaType) {
        return await prisma.post.findUnique({ where: { id } });
      }
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.post.findMany()
      }
    },
    profile: {
      type: profileType,
      args: {
        id: { type: UUIDType! },
      },
      async resolve(source, { id }: {id: string}, prisma: PrismaType) {
        return await prisma.profile.findUnique({ where: { id } });
      }
    },
    profiles: {
      type: new GraphQLList(profileType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.profile.findMany()
      }
    },
    user: {
      type: userType,
      args: {
        id: { type: UUIDType! },
      },
      async resolve(source, { id }: {id: string}, prisma: PrismaType) {
        return await prisma.user.findUnique({ where: { id } });
      }
    },
    users: {
      type: new GraphQLList(userType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.user.findMany()
      }
    },
  },
});

export const gqlSchema = new GraphQLSchema({ query });