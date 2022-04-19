### Adding / Updating Credit Cards

Cards data is defined in https://github.com/keithkade/keithkade.github.io/blob/develop/stuff/credit-card-category-coverage/src/cards.js

To add a new card, or update data on existing card, edit that file and create a pull request with your change. Pull requests should be into the develop branch. 

## Running the app

### Easy version (just the credit card page)

To see a basic version of things, the only build step is running babel on the javascript and opening index.html in a browser. The styles won't be quite right and there will be some extra stuff at the top of the page, but the core functionality should work. 

1. Install node / npm

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

2. Install npx

https://www.npmjs.com/package/npx

3. Install / run babel

`npx babel --watch stuff/credit-card-category-coverage/src --out-dir stuff/credit-card-category-coverage/build`

And that should be it. Changes to js in the src directory will get built and put in the build directory

### Hard version (building the full site)

Dependencies to build the site are a bit old, so there's potential weirdness ahead. In theory should work by:

1. Install ruby

https://www.ruby-lang.org/en/documentation/installation/

2. Install Jekyll and other dependencies

`gem install bundler`

3. Build the site with Jekyll

`bundle exec jekyll serve`

4. Navigate to http://localhost:4000/stuff/credit-card-category-coverage/

