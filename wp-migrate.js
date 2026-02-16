const axios = require("axios");
const fs = require("fs");

// --- configuracion  ---
const WP_GRAPHQL_URL = "https://vivirplenamente.com.ar/graphql"; // esta url ya no existe, porque esto era la pagina vieja
const BATCH_SIZE = 100;

// --- query para traer los posts ---
const query = `
  query GET_POSTS($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        date
        excerpt
        content(format: RENDERED)
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

async function fetchAllPosts() {
  let allPosts = [];
  let hasNextPage = true;
  let endCursor = null;
  let pageCount = 1;

  console.log(`Iniciando exportación de ${WP_GRAPHQL_URL}...`);

  while (hasNextPage) {
    try {
      const response = await axios.post(WP_GRAPHQL_URL, {
        query: query,
        variables: {
          first: BATCH_SIZE,
          after: endCursor,
        },
      });

      const data = response.data.data.posts;
      const posts = data.nodes;

      // agrego  los posts de esta página al array total
      allPosts = [...allPosts, ...posts];

      // preparo  la siguiente página
      hasNextPage = data.pageInfo.hasNextPage;
      endCursor = data.pageInfo.endCursor;

      process.stdout.write(
        `\rPágina ${pageCount} descargada. Total acumulado: ${allPosts.length} noticias...`,
      );
      pageCount++;
    } catch (error) {
      console.error(
        "\nError descargando:",
        error.response ? error.response.data : error.message,
      );
      break;
    }
  }

  // --- Gguardo todo en un arcghivo  ---
  fs.writeFileSync("posts_wordpress.json", JSON.stringify(allPosts, null, 2));
  console.log(
    `\n\n Éxito! Se guardaron ${allPosts.length} noticias en 'posts_wordpress.json'`,
  );
}

fetchAllPosts();
