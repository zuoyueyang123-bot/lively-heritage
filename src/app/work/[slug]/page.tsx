import { WorkDetail } from "@/components/proposal/work-detail";
import { findArtwork } from "@/lib/artwork-repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = await findArtwork(slug);
  return {
    title: artwork ? `${artwork.title} | 非遗有灵` : "非遗有灵作品",
    description: artwork?.prompt || "输入灵感，生成非遗文创提案。",
    openGraph: {
      title: artwork ? `${artwork.title} | 非遗有灵` : "非遗有灵作品",
      description: artwork?.prompt || "输入灵感，生成非遗文创提案。",
      images: [`/work/${slug}/opengraph-image`],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WorkDetail slug={slug} />;
}
