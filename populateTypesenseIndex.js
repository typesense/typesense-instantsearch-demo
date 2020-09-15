/* eslint-disable */

// Start Typesense server with `npm run typesenseServer`
// Then run `npm run populateTypesenseIndex` or `node populateTypesenseIndex.js`

const Typesense = require('typesense');

module.exports = (async () => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: 'jqeda7gwobunm1s4.a1.typesense.net',
        port: '443',
        protocol: 'https',
      },
    ],
    apiKey: 'lMFa0sxyKAqsSwD59ZYxxOSutTUA5heC',
  });

  const schema = {
      'name': 'books',
      'fields': [
        { 'name': 'title', 'type': 'string' },
        { 'name': 'authors', 'type': 'string[]' },
        { 'name': 'image_url', 'type': 'string' },

        { 'name': 'publication_year', 'type': 'int32' },
        { 'name': 'ratings_count', 'type': 'int32' },
        { 'name': 'average_rating', 'type': 'float' },

        { 'name': 'authors_facet', 'type': 'string[]', 'facet': true },
        { 'name': 'publication_year_facet', 'type': 'string', 'facet': true },
      ],
      'default_sorting_field': 'ratings_count',
    };

  console.log('Populating index in Typesense');

  try {
    await typesense.collections("books").delete();
    console.log("Deleting existing collection: books")
  } catch (error) {
    // Do nothing
  }

  console.log('Creating schema: ');
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  console.log('Adding records: ');
  const books = require('./data/books.json')
  try {
    const returnData = await typesense
      .collections('books')
      .documents()
      .createMany(books);
    console.log(returnData);
    console.log('Done indexing.');

    const failedItems = returnData.split("\n").filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`,
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
