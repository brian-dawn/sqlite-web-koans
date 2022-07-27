import initSqlJs, { SqlJsStatic } from "sql.js";
// Required to let webpack 4 know it needs to copy the wasm file to our assets
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export async function loadDb(): Promise<SqlJsStatic> {
  const SQL = await initSqlJs({ locateFile: () => sqlWasm });
  return SQL;
}
