import "./index.css";

export default function TableResponse({ data }) {
  if (!data || !data.columns || !data.rows) return null;

  return (
    <table className="response-table">
      <thead>
        <tr>
          {data.columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
