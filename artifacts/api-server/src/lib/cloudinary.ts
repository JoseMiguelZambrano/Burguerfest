import { v2 as cloudinary } from "cloudinary";

const strip = (v: string | undefined, name: string): string => {
  const raw = (v ?? "").trim();
  return raw.startsWith(`${name}=`) ? raw.slice(name.length + 1) : raw;
};
const cloud_name = strip(process.env.CLOUDINARY_CLOUD_NAME, "CLOUDINARY_CLOUD_NAME");
const api_key = strip(process.env.CLOUDINARY_API_KEY, "CLOUDINARY_API_KEY");
const api_secret = strip(process.env.CLOUDINARY_API_SECRET, "CLOUDINARY_API_SECRET");

if (!cloud_name || !api_key || !api_secret) {
  throw new Error(
    "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are required",
  );
}

cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

export async function uploadBuffer(
  buffer: Buffer,
  options: { folder?: string; resource_type?: "image" | "video" | "auto" } = {},
): Promise<{ secure_url: string; public_id: string }> {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder ?? "burger-fest",
        resource_type: options.resource_type ?? "auto",
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });
}
