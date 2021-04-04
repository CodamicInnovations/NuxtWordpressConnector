import axios from "axios";

const WP_URL = "<%= options.cmsUrl %>";

/**
 * Fetch all posts by given type from wordpress api.
 *
 * @param WpUrl URL of Wordpress Base
 * @param type Type of Content (posts, categories, ...)
 * @param params params for wordpress api
 * @return {Promise<any>}
 */
export async function getAllPosts(WpUrl, type, params) {
  // Default options
  let defaults = { status: "publish", context: "view", per_page: 100 };
  // overwrite default with module seetings
  const options = Object.assign({}, defaults, params);
  // console.log(options)
  const response = await axios.get(WpUrl + "/wp-json/wp/v2/" + type + "/", { params: options }).catch((error) => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
  return response.data;
}

function createWpConnect() {
  return {
    async getAllPosts(params) {
      // Default options
      let defaults = { status: "publish", context: "view", per_page: 100 };
      // overwrite default with module seetings
      const options = Object.assign({}, defaults, params);
      // fetch from cms
      const response = await axios.get(WP_URL + "/wp-json/wp/v2/posts/", options);
      return response.data;
    },
    async getPostById(id) {
      const response = await axios.get(WP_URL + "/wp-json/wp/v2/posts/" + id);
      return response.data;
    },
    async getAllCategories(parentId) {
      const params = {};
      if (parentId) {
        params.parent = parentId;
      }
      const response = await axios.get(WP_URL + "/wp-json/wp/v2/categories", { params });
      return response.data;
    },
    async getContentBySlug(type, slug) {
      const response = await axios.get(WP_URL + "/wp-json/wp/v2/" + type + "/?slug=" + slug);
      return response.data;
    },
    async getFeatureMedia(featuredMedia) {
      const response = await axios.get(featuredMedia.href);
      return response.data;
    }
  };
}

export default (ctx, inject) => {
  const wp = createWpConnect();
  ctx.$wp = wp;
  inject("wp", wp);
}
