import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";

// Talks to Cloudinary's SDK, which needs Node's stream/Buffer APIs — must
// run on the Node.js runtime, not edge.
export const runtime = "nodejs";

/**
 * Backs the rich text editor's inline "insert image" toolbar button (see
 * components/RichTextEditor.tsx). Unlike a post/project cover image —
 * uploaded inline inside POST /api/posts or /api/projects once the record
 * is being created — an image inserted into the editor becomes part of the
 * body's HTML immediately, before any post/project/comment exists yet to
 * attach an upload to. Hence its own small endpoint here instead of
 * reusing that inline pattern.
 */
function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "devcomm/editor" },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed with no result."));
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "You must be signed in to upload an image." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Expected multipart/form-data." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ message: "An image file is required." }, { status: 400 });
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json({ message: "The uploaded file must be an image." }, { status: 400 });
  }

  cloudinary.config();
  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploaded = await uploadImage(buffer);
    return NextResponse.json({ message: "Image uploaded.", url: uploaded.secure_url }, { status: 201 });
  } catch (error) {
    console.error("Editor image upload failed:", error);
    return NextResponse.json({ message: "Failed to upload the image." }, { status: 500 });
  }
}
