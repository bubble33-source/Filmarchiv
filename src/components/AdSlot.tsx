export function AdSlot({ placement, minHeight = 120 }: { placement: string; minHeight?: number }) {
  return (
    <div
      className="card"
      style={{ minHeight, display: "grid", placeItems: "center", color: "#94a3b8", borderStyle: "dashed" }}
      aria-label={`Ad-Slot ${placement}`}
    >
      <strong>Werbeplatz ({placement})</strong>
    </div>
  );
}
