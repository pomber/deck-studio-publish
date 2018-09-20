require("dotenv").config();
const fetch = require("node-fetch");

const packagejson = `{
  "dependencies": {
    "mdx-deck": "^1.7.4"
  }
}`;

const deck = `
# Hi
---
foo
`;

const dockerfile = `
FROM mhart/alpine-node:10
WORKDIR /usr/src
COPY package.json ./
RUN yarn
COPY . .
RUN yarn mdx-deck build deck.mdx
RUN mv ./dist /public
`;

module.exports = async req => {
  const files = [
    { file: "package.json", data: packagejson },
    { file: "deck.mdx", data: deck },
    { file: "Dockerfile", data: dockerfile }
  ];

  const token = process.env.NOW_TOKEN;

  const response = await fetch("https://api.zeit.co/v3/now/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      public: true,
      name: "publish-test",
      deploymentType: "STATIC",
      files
    })
  });
  const deployment = await response.json();
  console.log(deployment);

  return deployment.url;
};
