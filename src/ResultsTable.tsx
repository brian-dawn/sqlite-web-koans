import { QueryExecResult, SqlValue } from "sql.js";

interface ResultsTableProps {
  columns: string[];
  values: SqlValue[][];
}
/**
 * Renders a single value of the array returned by db.exec(...) as a table
 */
export function ResultsTable(props: ResultsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          {props.columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          props.values.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td
                  style={{
                    padding: ".25em",
                  }}
                  key={i}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
