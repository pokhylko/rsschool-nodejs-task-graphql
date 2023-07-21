import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId, memberType } from './types/member.js';
import { ChangePostInputType, CreatePostInputType, postType } from './types/post.js';
import {
  ChangeProfileInputType,
  CreateProfileInputType,
  profileType,
} from './types/profile.js';
import { ChangeUserInputType, CreateUserInputType, userType } from './types/user.js';
import { PrismaType } from './types/prisma.js';
import { deleteType } from './types/delete.js';

type CreatePost = {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
};

type ChangePost = {
  id: string;
  dto: {
    title: string;
    content: string;
  };
};

type DeletePost = {
  id: string;
};

type CreateProfile = {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
};

type ChangeProfile = {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
};

type DeleteProfile = {
  id: string;
};

type CreateUser = {
  dto: {
    name: string;
    balance: number;
  };
};

type ChangeUser = {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
};

type DeleteUser = {
  id: string;
};

type UserSubscribe = {
  userId: string;
  authorId: string;
};

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
  name: 'Query',
  fields: {
    memberType: {
      type: memberType,
      args: {
        id: { type: MemberTypeId! },
      },
      async resolve(source, { id }: { id: string }, prisma: PrismaType) {
        return await prisma.memberType.findUnique({ where: { id } });
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.memberType.findMany();
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: UUIDType },
      },
      async resolve(source, { id }: { id: string }, prisma: PrismaType) {
        return await prisma.post.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.post.findMany();
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: UUIDType! },
      },
      async resolve(source, { id }: { id: string }, prisma: PrismaType) {
        return await prisma.profile.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.profile.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: UUIDType! },
      },
      async resolve(source, { id }: { id: string }, prisma: PrismaType) {
        return await prisma.user.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLList(userType),
      async resolve(source, args, prisma: PrismaType) {
        return await prisma.user.findMany();
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: postType,
      args: { dto: { type: CreatePostInputType! } },
      async resolve(source, { dto }: CreatePost, prisma: PrismaType) {
        return await prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: postType,
      args: {
        id: { type: UUIDType! },
        dto: { type: ChangePostInputType! },
      },
      async resolve(source, { id, dto }: ChangePost, prisma: PrismaType) {
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },
    deletePost: {
      type: deleteType,
      args: { id: { type: UUIDType! } },
      async resolve(source, { id }: DeletePost, prisma: PrismaType) {
        await prisma.post.delete({ where: { id } });
      },
    },
    createProfile: {
      type: profileType,
      args: { dto: { type: CreateProfileInputType } },
      async resolve(source, { dto }: CreateProfile, prisma: PrismaType) {
        return await prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: profileType,
      args: {
        id: { type: UUIDType! },
        dto: { type: ChangeProfileInputType },
      },
      async resolve(source, { id, dto }: ChangeProfile, prisma: PrismaType) {
        return await prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteProfile: {
      type: deleteType,
      args: { id: { type: UUIDType! } },
      async resolve(source, { id }: DeleteProfile, prisma: PrismaType) {
        await prisma.profile.delete({ where: { id } });
      },
    },
    createUser: {
      type: userType,
      args: { dto: { type: CreateUserInputType } },
      async resolve(source, { dto }: CreateUser, prisma: PrismaType) {
        return await prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: userType,
      args: {
        id: { type: UUIDType! },
        dto: { type: ChangeUserInputType },
      },
      async resolve(source, { id, dto }: ChangeUser, prisma: PrismaType) {
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteUser: {
      type: deleteType,
      args: { id: { type: UUIDType! } },
      async resolve(source, { id }: DeleteUser, prisma: PrismaType) {
        await prisma.user.delete({ where: { id } });
      },
    },
    subscribeTo: {
      type: userType,
      args: {
        userId: { type: UUIDType! },
        authorId: { type: UUIDType! },
      },
      async resolve(source, { userId, authorId }: UserSubscribe, prisma: PrismaType) {
        return await prisma.user.update({
          where: { id: userId },
          data: { userSubscribedTo: { create: { authorId } } },
        });
      },
    },
    unsubscribeFrom: {
      type: deleteType,
      args: {
        userId: { type: UUIDType! },
        authorId: { type: UUIDType! },
      },
      async resolve(source, { userId, authorId }: UserSubscribe, prisma: PrismaType) {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
      },
    },
  }),
});

export const gqlSchema = new GraphQLSchema({
  query,
  mutation,
});
