import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: ["test-results/**"],
  },
];

export default config;
