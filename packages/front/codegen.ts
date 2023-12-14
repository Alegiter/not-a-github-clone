
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://docs.github.com/public/schema.docs.graphql",
  documents: "src/shared/api/github/api.ts",
  generates: {
    "packages/front/src/shared/api/github/__graphql__/": {
      preset: "client",
      plugins: [],
      config: {
        enumsAsTypes: true,
        avoidOptionals: true
      }
    },
    [`${folder}/introspection.json`]: {
      plugins: [
        "introspection"
      ]
    }
  }
};

export default config;
