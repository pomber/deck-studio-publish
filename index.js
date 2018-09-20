require("dotenv").config();
const fetch = require("node-fetch");
const { json } = require("micro");

const packagejson = `{
  "dependencies": {
    "mdx-deck": "^1.7.4",
    "mdx-deck-code-surfer": "^0.4.1"
  }
}`;

const dockerfile = `
FROM mhart/alpine-node:10
WORKDIR /usr/src
COPY package.json ./
RUN yarn
COPY . .
RUN yarn mdx-deck build --no-html deck.mdx
RUN mv ./dist /public
`;

module.exports = async (req, res) => {
  //TODO remove Dockerfile from user files just in case
  const userFiles = await json(req);
  const infraFiles = [
    { file: "package.json", data: packagejson },
    { file: "Dockerfile", data: dockerfile }
  ];

  console.log(userFiles);

  const token = process.env.NOW_TOKEN;

  const response = await fetch("https://api.zeit.co/v3/now/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      public: true,
      name: "deck-studio",
      deploymentType: "STATIC",
      files: [...userFiles, ...infraFiles]
    })
  });
  const deployment = await response.json();
  console.log(deployment);

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Access-Control-Allow-Origin", "https://deck-studio.now.sh");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  return "https://" + deployment.url;
};
