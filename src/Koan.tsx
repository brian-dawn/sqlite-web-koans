import { useState } from "react";
import { Database, QueryExecResult } from "sql.js";
import { ResultsTable } from "./ResultsTable";

interface KoanProps {
  db: Database;

  meditation: string;

  // The koan prompt, consecutive underscores are what the user changes.
  prompt: string;

  // The correct query to compare against once executed.
  answer: string;
}

export const Koan = (props: KoanProps) => {
  const [error, setError] = useState<unknown | null>(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);
  const [prompt, setPrompt] = useState(props.prompt);

  const answer = props.db.exec(props.answer);

  const solved = JSON.stringify(answer) === JSON.stringify(results);
  console.log("answer", answer, results, solved);

  const exec = (sql: string) => {
    try {
      setResults(props.db.exec(sql));
      setError(null);
    } catch (err) {
      setError(err);
      setResults([]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "center",
        padding: ".5em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            color: solved ? "green" : "red",
            marginRight: ".5em",
          }}
        >
          {props.meditation}
        </h3>

        <button
          style={{
            marginRight: "1em",
          }}
          onClick={() => {
            exec(prompt);
          }}
        >
          Run
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <textarea
          style={{
            padding: ".5em",
            width: "20em",
            height: "1em",
          }}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />

        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }

        {error !== null && <pre>{String(error)}</pre>}
      </div>
    </div>
  );
};
