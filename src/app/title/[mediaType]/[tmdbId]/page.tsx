import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { CommunityScore } from "@/components/CommunityScore";
import { RatingWidget } from "@/components/RatingWidget";
import { TrailerSection } from "@/components/TrailerSection";
import { normalizeMediaType } from "@/lib/mediaType";
import { getTitleDetails, getTitleVideos } from "@/lib/tmdb";

export default async function Page({ params }: { params: Promise<{ mediaType: string; tmdbId: string }> }) {
  const { mediaType: rawMediaType, tmdbId } = await params;
  const mediaType = normalizeMediaType(rawMediaType);

  if (!mediaType) {
    notFound();
  }

  const tmdbIdNumber = Number(tmdbId);
  if (!Number.isFinite(tmdbIdNumber)) {
    notFound();
  }

  const [details, videos] = await Promise.all([
    getTitleDetails(mediaType, tmdbIdNumber),
    getTitleVideos(mediaType, tmdbIdNumber)
  ]);

  const trailer = videos[0];

  return (
    <div className="grid">
      <section className="card">
        <h2>{details.title ?? details.name}</h2>
        <p>{details.overview}</p>
        <p>TMDB Rating: {details.vote_average.toFixed(1)}</p>
      </section>

      <AdSlot placement="detail-inline" minHeight={120} />

      <section className="grid grid-2">
        <CommunityScore tmdbId={tmdbIdNumber} mediaType={mediaType} />
        <RatingWidget tmdbId={tmdbIdNumber} mediaType={mediaType} />
      </section>

      <section className="card">
        <h3>Trailer</h3>
        <TrailerSection youtubeKey={trailer?.key} />
      </section>
    </div>
  );
}
