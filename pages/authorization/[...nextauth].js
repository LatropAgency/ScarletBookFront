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
        redirect: async (url, _baseUrl) => {
            if (url === '/profile') {
                return Promise.resolve('/');
            }
            return Promise.resolve('/');
        },
    },
})