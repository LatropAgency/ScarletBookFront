import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: '1067054625545-fj6l1dntl0i4atb3fv451sgmt61tvv6m.apps.googleusercontent.com',
            clientSecret: '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',
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
        }),
        // ...add more providers here
    ],
    jwt: {
        encryption: true,
    },
    callbacks: {
        async jwt(token, account) {
            if (account?.accessToken) {
                token.accessToken = account.accessToken;
            }
            return token;
        },
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                return profile.email_verified && profile.email.endsWith("@example.com")
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
        redirect: async (url, _baseUrl) => {
            if (url === '/users') {
                return Promise.resolve('/');
            }
            return Promise.resolve('/');
        },
    },
})