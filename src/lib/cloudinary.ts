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

export type UploadedBlogImage = {
  publicId: string;
  url: string;
  filename: string;
  format: string | null;
  width: number;
  height: number;
  bytes: number;
};

/**
 * Upload a blog cover or in-body image into the `blog/` folder. Images are
 * capped at 2000px and re-encoded to the best format the requesting browser
 * supports, so editors can drop full-resolution photos in without thinking
 * about page weight.
 */
export async function uploadBlogImage(file: File): Promise<UploadedBlogImage> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    format?: string;
    width?: number;
    height?: number;
    bytes: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "blog",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          transformation: [
            { width: 2000, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
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
    url: result.secure_url,
    filename: file.name,
    format: result.format ?? null,
    width: result.width ?? 0,
    height: result.height ?? 0,
    bytes: result.bytes,
  };
}

/** Remove a blog image from Cloudinary. Safe to call for already-gone assets. */
export async function destroyBlogImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

export type UploadedBlogAudio = {
  publicId: string;
  url: string;
  bytes: number;
};

/**
 * Upload a generated narration MP3 into the `blog-audio/` folder. Cloudinary
 * classifies audio under the "video" resource type, so that type must be used
 * both here and when destroying the asset later.
 */
export async function uploadBlogAudio(
  buffer: Buffer,
  slug: string,
  lang: string
): Promise<UploadedBlogAudio> {
  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    bytes: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "blog-audio",
          resource_type: "video",
          public_id: `${slug}-${lang}`,
          // Overwrite the previous narration for this slug+lang rather than
          // accumulating a new asset on every regeneration.
          overwrite: true,
          invalidate: true,
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
    url: result.secure_url,
    bytes: result.bytes,
  };
}

/** Remove a narration asset from Cloudinary. Safe for already-gone assets. */
export async function destroyBlogAudio(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true,
  });
}
