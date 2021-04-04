const path = require("path");
const fs = require("fs");
import { getAllPosts } from "./plugins/wordpress";

const cachePath = ".nuxt/wp-cache.json";
const cacheContentPath = ".nuxt/wp-content-cache.json";
let pageCache = {};
let pageContentCache = {};

export default function() {
  if (fs.existsSync(cachePath)) {
    let rawdata = fs.readFileSync(cachePath);
    pageCache = JSON.parse(rawdata);
    rawdata = fs.readFileSync(cacheContentPath);
    pageContentCache = JSON.parse(rawdata);
  }
  console.info(
    "Nuxt Wordpress Headless initialized",
    this.options.nuxtWordpressHeadless.cms
  );
  // npm run build -> fetch routes
  this.nuxt.hook("build:extendRoutes", async (routes) => {
    for (let mapper of this.options.nuxtWordpressHeadless.map) {
      // console.info("read " + mapper.link);
      // list from wordpress
      try {
        let data = [];
        if (pageCache[mapper.link] == null) {
          data = await getAllPosts(this.options.nuxtWordpressHeadless.cms, mapper.type || "posts", mapper.options || {});
          pageCache[mapper.link] = data;
        } else {
          data = pageCache[mapper.link];
        }
        // generate routes
        data.forEach(item => {
          // console.info(mapper.link + "/" + item.slug);
          routes.push({
            // name: mapper.link,
            path: mapper.link + "/" + item.slug,
            // component: resolve(__dirname, 'pages/_page.vue')
            payload: item
          });
          pageContentCache[mapper.link + "/" + item.slug] = item;
        });
      } catch (e) {
        // console.error(e);
      }
    }
    // Cache routes
    fs.writeFileSync(cachePath, JSON.stringify(pageCache));
    fs.writeFileSync(cacheContentPath, JSON.stringify(pageContentCache));
  });

  // npm run generate -> fetch payloads
  this.nuxt.hook("generate:route", ({ route, setPayload }) => {
    if(pageContentCache[route]) {
      setPayload(pageContentCache[route])
    }
  });

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, "plugins/wordpress.js"),
    ssr: true,
    options: {
      cmsUrl: this.options.nuxtWordpressHeadless.cms,
    }
  });
}

module.exports.meta = require("./package.json");
