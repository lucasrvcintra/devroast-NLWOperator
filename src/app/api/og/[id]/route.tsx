import { ImageResponse } from "@takumi-rs/image-response";
import { OGError } from "@/components/og/og-error";
import { RoastOGImage } from "@/components/og/roast-og-image";
import { createCaller } from "@/trpc/server";

const width = 1200;
const height = 630;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const caller = await createCaller();

  try {
    const data = await caller.roast.getById({ id });
    const response = new ImageResponse(<RoastOGImage roast={data.roast} />, {
      width,
      height,
      format: "png",
    });

    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    return response;
  } catch {
    const response = new ImageResponse(<OGError />, {
      width,
      height,
      format: "png",
    });

    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    return response;
  }
}
