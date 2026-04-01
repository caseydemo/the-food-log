const styles: Record<string, string> = new Proxy(
  {},
  { get: (_, prop) => String(prop) }
);

export default styles;
