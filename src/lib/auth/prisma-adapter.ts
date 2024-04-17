import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {},

    async getUser(id) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
      })

      return {
        id: user.id,
        name: user?.name,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        created_at: user?.created_at,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email },
      })

      return {
        id: user.id,
        name: user?.name,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        created_at: user?.created_at,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { user } = await prisma.account.findFirstOrThrow({
        where: {
          provider_account_id: providerAccountId,
          provider,
        },
        include: {
          user: true,
        },
      })

      return {
        id: user.id,
        name: user?.name,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser?.name,
        email: prismaUser.email!,
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refreshToken,
          access_token: account.accessToken,
          expires_at: account.expiresAt,
          token_type: account.tokenType,
          scope: account.scope,
          id_token: account.idToken,
          session_state: account.sessionState,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        sessionToken,
        userId,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const { user, ...session } = await prisma.session.findFirstOrThrow({
        where: { session_token: sessionToken },
        include: {
          user: true,
        },
      })

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user?.name,
          email: user.email!,
          avatar_url: user.avatar_url!,
          emailVerified: null,
        },
      }
    },

    async updateSession({ sessionToken }) {},
    
    async createVerificationToken({ identifier, expires, token }) {},
    async useVerificationToken({ identifier, token }) {},
  }
}
