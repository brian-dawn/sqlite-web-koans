import React, { useState, useEffect } from "react";
import "./styles.css";
import initSqlJs, { Database } from "sql.js";
import { loadDb } from "./db";

export default function App() {
  const [db, setDb] = useState<null | Database>(null);
  const [error, setError] = useState<null | any>(null);

  useEffect(() => {
    const invoke = async () => {
      // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
      // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
      // see ../craco.config.js
      try {
        const SQL = await loadDb();
        setDb(new SQL.Database());
      } catch (err) {
        setError(err);
      }
    };
    invoke();
  }, []);

  if (error) return <pre>{error.toString()}</pre>;
  else if (!db) return <pre>Loading...</pre>;
  else return <SQLRepl db={db} />;
}

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
function SQLRepl({ db }: { db: Database }) {
  const [error, setError] = useState<null | any>(null);
  const [results, setResults] = useState<any[]>([]);

  function exec(sql: string) {
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      setResults(db.exec(sql)); // an array of objects is returned
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setResults([]);
    }
  }

  return (
    <div className="App">
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <pre className="error">{(error || "").toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }
      </pre>
    </div>
  );
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({
  columns,
  values,
}: {
  columns: string[];
  values: any[];
}) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(
            (
              columnName:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined,
              i: React.Key | null | undefined
            ) => (
              <td key={i}>{columnName}</td>
            )
          )}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values.map((row: any[], i: React.Key | null | undefined) => (
            <tr key={i}>
              {row.map(
                (
                  value:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined,
                  i: React.Key | null | undefined
                ) => (
                  <td key={i}>{value}</td>
                )
              )}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
