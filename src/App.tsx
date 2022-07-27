import { useState, useEffect } from "react";
import "./styles.css";
import { Database, QueryExecResult } from "sql.js";
import { loadDb, populateDb } from "./db";
import { Koan } from "./Koan";
import { ResultsTable } from "./ResultsTable";

export default function App() {
  const [db, setDb] = useState<null | Database>(null);
  const [error, setError] = useState<unknown>(null);

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

  if (error) return <pre>{String(error)}</pre>;
  else if (!db) return <pre>Loading...</pre>;
  else return <SQLRepl db={db} />;
}

function SQLRepl({ db }: { db: Database }) {
  const [error, setError] = useState<unknown>(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  populateDb(db);

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
      <Koan
        db={db}
        meditation={"Meditate on upper-case queries"}
        prompt={"SELECT 1"}
        answer={"SELECT 1"}
      />

      <Koan
        db={db}
        meditation={"Meditate on lower-case queries"}
        prompt={"_ 1"}
        answer={"SELECT 1"}
      />

      <Koan
        db={db}
        meditation={"Meditate on selecting all columns from a table"}
        prompt={"select * from book"}
        answer={"select * from book"}
      />

      <Koan
        db={db}
        meditation={"Meditate on selecting one column (title) from a table"}
        prompt={"select _ from book"}
        answer={"select title from book"}
      />
    </div>
  );
}
