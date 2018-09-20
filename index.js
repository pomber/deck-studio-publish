require("dotenv").config();
const fetch = require("node-fetch");

module.exports = async req => {
  const files = [
    { file: "index.html", data: "<html><body>INDEX</body></html>" }
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
