import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { postType } from './post.js';
import { PrismaType } from './prisma.js';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType! },
    name: { type: GraphQLString! },
    balance: { type: GraphQLFloat! },
    profile: {
      type: profileType,
      async resolve({ id }: { id: string }, args, prisma: PrismaType) {
        return await prisma.profile.findUnique({
          where: {
            userId: id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve({ id }: { id: string }, args, prisma: PrismaType) {
        return await prisma.post.findMany({
          where: {
            authorId: id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      async resolve({ id }: { id: string }, args, prisma: PrismaType) {
        return await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      async resolve({ id }: { id: string }, args, prisma: PrismaType) {
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
      },
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString! },
    balance: { type: GraphQLFloat! },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
