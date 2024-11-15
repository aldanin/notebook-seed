declare module "*.css" {
  const content: string;
  export = content;
}

declare module "*.png" {
  const value: string;

  export default value;
}
