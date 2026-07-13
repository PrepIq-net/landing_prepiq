import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadedAttachment = {
  publicId: string;
  resourceType: string;
  url: string;
  filename: string;
  format: string | null;
  bytes: number;
};

/**
 * Upload a support attachment into the dedicated `support/` folder.
 * resource_type "auto" lets Cloudinary classify images vs raw files (logs,
 * CSVs…); the resulting resource_type must be stored because destroying an
 * asset later requires the matching type.
 */
export async function uploadSupportAttachment(
  file: File
): Promise<UploadedAttachment> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    public_id: string;
    resource_type: string;
    secure_url: string;
    format?: string;
    bytes: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "support",
          resource_type: "auto",
          // Keep the original name readable in the admin while letting
          // Cloudinary guarantee uniqueness.
          use_filename: true,
          unique_filename: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error("Upload failed"));
          else resolve(uploadResult);
        }
      )
      .end(buffer);
  });

  return {
    publicId: result.public_id,
    resourceType: result.resource_type,
    url: result.secure_url,
    filename: file.name,
    format: result.format ?? null,
    bytes: result.bytes,
  };
}

/** Remove the asset from Cloudinary. Safe to call for already-gone assets. */
export async function destroySupportAttachment(
  publicId: string,
  resourceType: string
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType || "image",
    invalidate: true,
  });
}
