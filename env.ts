import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";
const defaultAppUrl = isProduction
  ? "https://codehive2k26.vercel.app"
  : "http://localhost:3000";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url().default(defaultAppUrl),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),
  // Tigris AWS S3 Storage
  AWS_ACCESS_KEY_ID: z.string().optional().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(""),
  AWS_REGION: z.string().optional().default("auto"),
  AWS_ENDPOINT_URL_S3: z.string().optional().default("https://t3.storage.dev"),
  AWS_ENDPOINT_URL_IAM: z.string().optional().default("https://iam.storage.dev"),
  AWS_BUCKET_NAME: z.string().optional().default("codehive"),
  TIGRIS_STORAGE_ACCESS_KEY_ID: z.string().optional().default(""),
  TIGRIS_STORAGE_SECRET_ACCESS_KEY: z.string().optional().default(""),
  TIGRIS_ENDPOINT_URL: z.string().optional().default("https://t3.storage.dev"),
  TIGRIS_REGION: z.string().optional().default("auto"),
  TIGRIS_BUCKET_NAME: z.string().optional().default("codehive"),
  TIGRIS_PUBLIC_URL: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default("smtp.gmail.com"),
  SMTP_PORT: z.string().optional().default("587"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default("CodeHive 2K26 <no-reply@codehive2k26.com>"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default(defaultAppUrl),
});

const isServer = typeof window === "undefined";

const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

const serverEnv = isServer
  ? {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
      AWS_ENDPOINT_URL_IAM: process.env.AWS_ENDPOINT_URL_IAM,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
      TIGRIS_STORAGE_ACCESS_KEY_ID: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID,
      TIGRIS_STORAGE_SECRET_ACCESS_KEY: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY,
      TIGRIS_ENDPOINT_URL: process.env.TIGRIS_ENDPOINT_URL,
      TIGRIS_REGION: process.env.TIGRIS_REGION,
      TIGRIS_BUCKET_NAME: process.env.TIGRIS_BUCKET_NAME,
      TIGRIS_PUBLIC_URL: process.env.TIGRIS_PUBLIC_URL,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM,
    }
  : {};

const parsedClient = clientSchema.safeParse(clientEnv);
if (!parsedClient.success) {
  console.error("❌ Invalid client environment variables:", parsedClient.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables");
}

let parsedServer = {} as z.infer<typeof serverSchema>;
if (isServer) {
  const result = serverSchema.safeParse(serverEnv);
  if (!result.success) {
    console.error("❌ Invalid server environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }
  parsedServer = result.data;
}

export const env = {
  ...parsedServer,
  ...parsedClient.data,
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

export default env;
