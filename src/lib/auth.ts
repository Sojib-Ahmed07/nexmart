import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
    },
  },

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
      const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

      try {
        const response = await fetch(BREVO_API_URL, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY as string,
            "content-type": "application/json",
          },

          body: JSON.stringify({
            sender: {
              name: "NexMart",
              email: "menarebrave7878@gmail.com"
            },

            to: [{ email: user.email, name: user.name }],
            subject: "Reset your NexMart Password",
            htmlContent: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #4f46e5; margin-bottom: 16px;">Password Reset Request</h2>
                <p style="color: #374151; line-height: 1.5;">Hi ${user.name},</p>
                <p style="color: #374151; line-height: 1.5;">We received a request to reset your password for your NexMart account. Click the link below to set up a new password:</p>
                <div style="margin: 24px 0;">
                  <a href="${url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">If you didn't request this change, you can safely ignore this email. This link will expire shortly.</p>
              </div>
            `,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error("Brevo API Error Details:", errData);
        }

      } catch (error) {
        console.error("Failed to route reset password email payload through Brevo:", error);
      }
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
      const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

      try {
        const response = await fetch(BREVO_API_URL, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY as string,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "NexMart",
              email: "menarebrave7878@gmail.com"
            },
            to: [{ email: user.email, name: user.name }],
            subject: "Verify your NexMart Account",
            htmlContent: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #4f46e5; margin-bottom: 16px;">Verify Your Email Address</h2>
                <p style="color: #374151; line-height: 1.5;">Hi ${user.name},</p>
                <p style="color: #374151; line-height: 1.5;">Thank you for registering with NexMart! Please click the button below to verify your email address and activate your account:</p>
                <div style="margin: 24px 0;">
                  <a href="${url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; display: inline-block;">Verify Email</a>
                </div>
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">If you did not create an account, no further action is required.</p>
              </div>
            `,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error("Brevo Verification Email Error:", errData);
        }
      } catch (error) {
        console.error("Failed to send verification email via Brevo:", error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  experimental: {
    joins: true,
  },
});
