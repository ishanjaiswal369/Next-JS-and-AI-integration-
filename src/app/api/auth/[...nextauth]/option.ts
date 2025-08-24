import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const { handlers, auth, signIn } = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/signin",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect();

                const email = String(credentials.email).toLowerCase().trim();
                const existingUser = await UserModel.findOne({ email });

                console.log("existing user is ", existingUser);

                if (!existingUser) {
                    throw new Error("Invalid Credentials");
                }

                if (!existingUser.isVerified) {
                    throw new Error("user not verified please verify using email");
                }

                const isValidPassword = true; //await bcrypt.compare(String(credentials.password), String(existingUser.password));

                if (!isValidPassword) {
                    throw new Error("password does not matches, please try again");
                }

                return {
                    id: existingUser.id,
                    name: existingUser.username,
                    email: existingUser.email,
                    username: existingUser.username,
                    isVerified: existingUser.isVerified,
                    isAcceptingMessages: existingUser.isAcceptingMessages,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = (user as any).id || (user as any)._id?.toString();
                token.name = (user as any).username || user.name || token.name;
                token.email = (user as any).email || token.email;
                token.username = (user as any).username;
                token.isVerified = (user as any).isVerified;
                token.isAcceptingMessages = (user as any).isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).name = token.name || session.user.name || null;
                (session.user as any).email = token.email || session.user.email;
                (session.user as any).username = token.username;
                (session.user as any).isVerified = token.isVerified;
                (session.user as any).isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
    },
});