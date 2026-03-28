import type { ThreadUsage } from "../utils/dmc-colors";

interface ThreadListProps {
  usages: ThreadUsage[];
}

export function ThreadList({ usages }: ThreadListProps) {
  const totalStitches = usages.reduce((sum, u) => sum + u.stitchCount, 0);
  const totalSkeins = usages.reduce((sum, u) => sum + u.skeins, 0);

  return (
    <div className="thread-list">
      <h3>Thread Shopping List</h3>
      {usages.length === 0 ? (
        <p className="thread-list-empty">No threads yet. Start drawing!</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Color</th>
                <th>DMC</th>
                <th>Name</th>
                <th>Stitches</th>
                <th>Skeins</th>
              </tr>
            </thead>
            <tbody>
              {usages.map((usage, i) => (
                <tr key={usage.thread.code}>
                  <td>{i + 1}</td>
                  <td>
                    <span
                      className="color-swatch"
                      style={{
                        backgroundColor: `rgb(${usage.thread.color.r},${usage.thread.color.g},${usage.thread.color.b})`,
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        border: "1px solid #ccc",
                        verticalAlign: "middle",
                      }}
                    />
                  </td>
                  <td>{usage.thread.code}</td>
                  <td>{usage.thread.name}</td>
                  <td>{usage.stitchCount}</td>
                  <td>{usage.skeins}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="thread-totals">
            <strong>
              Total: {totalStitches} stitches, {totalSkeins} skeins
            </strong>
          </div>
        </>
      )}
    </div>
  );
}
