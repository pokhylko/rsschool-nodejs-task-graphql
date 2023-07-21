import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const LIMIT_THE_COMPLEXITY = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async preHandler(req, reply) {
      const errors = validate(gqlSchema, parse(req.body.query), [depthLimit(LIMIT_THE_COMPLEXITY)]);

      if (errors.length > 0) {
        await reply.send({ errors })
      }
    },
    
    async handler(req) {
      return await graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: prisma,
      });
    },
  });
};

export default plugin;
