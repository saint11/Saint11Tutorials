// @ts-check

const https = require("https");
const fs = require("fs");

const {
  ARTICLE_URL = "https://saint11.org/blog/pixel-art-tutorials/",
  GIFS_URL = "https://blfunex.github.io/Saint11Tutorials/gifs/",
  IMAGES_URL = "https://saint11.org/img/pixel-tutorials/",
} = process.env;

const regex = /<h5\s+id="([^"]+)"[^>]*>([^<]+)<\/h5>\s+<p>.+src="(..\/..\/img\/pixel-tutorials\/([^\.]+)\.gif|[^"]+)"[^<]+(<img[^<]+)?<\/p>/g;
const ui9rx = /src="(..\/..\/img\/pixel-tutorials\/([^\.]+)\.gif|[^"]+)"[^<]+<\/p>$/;

function getImageURL(name) {
  return name === null
    ? null
    : fs.existsSync(`./gifs/${name}.gif`)
    ? fs.existsSync(`./gifs/${name}.GIF`)
      ? `${GIFS_URL}${name}.GIF`
      : `${GIFS_URL}${name}.gif`
    : null;
}

function getImagesData(src, name) {
  return {
    src: new URL(src, ARTICLE_URL).href,
    scaled: getImageURL(name),
    unscaled: getImageURL(name + "1x"),
  };
}

/**
 * @param {string} text
 */
function scrape(text) {
  const data = [];
  // @ts-expect-error // Not returning a string.
  text.replace(regex, (text, id, tags, src, image, hasAppendix) => {
    let appendix = null;

    // Special case for the UI 9 Slice article
    if (hasAppendix) {
      const match = text.match(ui9rx);
      appendix = getImagesData(match[1], match[2]);
    }

    data.push({
      id,
      tags: tags
        .split(/\s+/)
        .map(x => (x.startsWith("#") ? x.slice(1) : x)),
      images: getImagesData(src, image),
      appendix,
    });
  });

  console.log(`Scrapped ${data.length} tutorial(s).`);

  fs.writeFileSync("scrapped.json", JSON.stringify(data, undefined, 2));
}

const request = https.request(ARTICLE_URL, { method: "GET" }, response => {
  let text = "";
  response.on("data", chunk => (text += chunk));
  response.on("end", () => scrape(text));
});

request.end();
