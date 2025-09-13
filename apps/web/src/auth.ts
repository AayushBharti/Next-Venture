import { client } from "@workspace/sanity/client";
import { queryAuthorByGithubId } from "@workspace/sanity/query";
import { writeClient } from "@workspace/sanity/write-client";
import NextAuth, { type NextAuthResult } from "next-auth";
import GitHub from "next-auth/providers/github";

/** Download a GitHub avatar and upload it to Sanity as an image asset. */
async function uploadGithubAvatar(avatarUrl: string, username: string) {
  const res = await fetch(avatarUrl);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await writeClient.assets.upload("image", buffer, {
    filename: `${username}-avatar.png`,
    contentType: "image/png",
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

const nextAuth: NextAuthResult = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      if (!profile) {
        return false;
      }

      const { id, login, bio } = profile;
      const avatarUrl =
        image || (profile as { avatar_url?: string }).avatar_url;

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(queryAuthorByGithubId, { id });

      if (!existingUser) {
        const imageField = avatarUrl
          ? await uploadGithubAvatar(avatarUrl, login as string)
          : undefined;

        await writeClient.create({
          _type: "author",
          githubId: id,
          name: name || login,
          username: login,
          email: email || "",
          bio: (bio as string) || "",
          ...(imageField && { image: imageField }),
        });
      } else if (!existingUser.image && avatarUrl) {
        const imageField = await uploadGithubAvatar(avatarUrl, login as string);
        if (imageField) {
          await writeClient
            .patch(existingUser._id)
            .set({ image: imageField })
            .commit();
        }
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(queryAuthorByGithubId, { id: profile.id });

        token.id = user?._id;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});

export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;
