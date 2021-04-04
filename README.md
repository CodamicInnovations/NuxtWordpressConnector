# Nuxt - Wordpress Headless Connector
This is a nuxt module to fetch Wordpress-Articles, Pages, Posts and more from a Wordpress instance.
It's build to fetch all pages and create dynamic routes in a static server context.

## Idea behind this module
We want a SEO friendly installation of Wordpress with a vue implementation. So we choose wordpress, because it's an 
easy-to-use CMS, even for customers, who want to add news and pages for their own. So the idea was a nightly static 
build from a nuxt app with the content of Wordpress, fetched from WP-API.

## Setup
1) Install a new Nuxt-Project or choose existing one. Add "@codamic/nuxt-wordpress-headless" to your project via npm.
``npm install -s @codamic/nuxt-wordpress-headless``


2) Add Module to your ***nuxt.config.js***
```
// nuxt.config.js
export default {
  // ...
  // register module
  modules: [
    // ...
    '@codamic/nuxt-wordpress-headless'
  ],
  // CMS Options:
  nuxtWordpressHeadless: {
    cms: 'https://cms.codamic.com/',
    map: [
      { // all pages to one point
        link: '/pages',
        type: 'pages',
        options: {} // WP Options API
      },
      { // all sub pages pages to one point
        link: '/subpage',
        type: 'pages',
        options: { parent_id: 123 } // WP Options API
      },
      { // all pages to one point
        link: '/posts',
        type: 'posts',
        options: {} // WP Options API
      },
    ]
  },
}
```

3) Add additional dynamic routes to your build-part in your ***nuxt.config.js*** (create if not exists)

## Use the Plugin

1) Create simple dynamic pages (Path: /pages/_slug.vue)

```
{
  // ... your page content ...
  async asyncData({app, params, payload}) {
    if(payload) {
      // PRODUCTION
      return {
        page: payload,
      }
    }
    try {
      // DEVELOPMENT
      const page = await app.$wp.getPageBySlug(params.partner);
      return {
        page: page[0],
      }
    } catch (e) {
      console.log(e)
      // your error management here ...
    }
  }
```

## Handle Wordpress Content

**See Wordpress-Rest API for Parameter and Responses:** https://developer.wordpress.org/rest-api/


1) Get Content

**Page Title:**

```
<h1 v-html="page.title.rendered" />
```

**Page Content:**

```
<div v-html="page.content.rendered" />
```

2) WP-Classes

You need to set the wp-classes to match blocks from Gutenberg Editor in your pages. 

3) Fetch Media from Wordpress

```this.$wp.getFeatureMedia(media)```

## Under development

We are working currently on this plugin each time our customers required new features. So stay tuned and/or create your 
feature request.

# Developers

This Module is maintained by Codamic Innovations GmbH (Germany, Wiesbaden). We want to automate the process of 
development with tools and open source. Please feel free to visit our website. 

https://www.codamic.com

# Roadmap

- replace urls in content to nuxt base
- more api
- more functions for easy rest api reading
