export function crash(msg: string, ...items: object[]) {
  console.log("-——————————Debug-——————————");
  console.log(items);
  throw new Error(msg);
}
