const http = require("http");
const https = require("https");

const PORT = 3000;

const sendRequest = (cb) => {
  let content = "";
  const options = {
    hostname: "time.com",
    path: "/"
  };

  https.get(options, res => {
    res.setEncoding("utf8");

    res.on("data", data => (content += data));

    res.on("end", () => cb(content));
  }).on("error", error => {
    console.error(error);
  });
};

const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    sendRequest(html => {
      const result = html.match(/<li class="latest-stories__item">(.|\n)*?<\/li>/g);
      const stories = [];
      result.forEach(story => stories.push({
        title: story.match(/(?<=<h3 (.*?)>)(.*?)(?=<\/h3>)/g)[0],
        link: "https://time.com" + story.match(/(?<=href=['"])(.*?)(?=['"])/g)[0]
      }));
      res.end(JSON.stringify(stories));
    });
  } else {
    res.end();
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
