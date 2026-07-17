import { auth } from "@clerk/nextjs/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST() {
  await auth.protect();

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "project-sphere/covers";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
