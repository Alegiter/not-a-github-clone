
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://docs.github.com/public/schema.docs.graphql",
  documents: "packages/front/src/shared/api/github/documents.gql",
  generates: {
    "packages/front/src/shared/api/github/__graphql__/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
