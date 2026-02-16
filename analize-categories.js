const { log } = require('console');
const fs = require('fs');

// el archivo q generó antes el script
const DATA_SOURCE = './posts_wordpress.json';

try {
    console.log('Leyendo archivo JSON...');
    const rawData = fs.readFileSync(DATA_SOURCE);
    const posts = JSON.parse(rawData);
    
    const stats = {};

    // 1. recorro dtodos los posts
    posts.forEach(post => {
        // obtener nombre categoria, solo si existe
        const rawName = post.categories?.nodes[0]?.name || 'Sin Categoría';
        
        // normalizar a minisculas para poder usarlo en el mapa
        const key = rawName.toLowerCase().trim();

        if (!stats[key]) {
            stats[key] = { 
                originalName: rawName, 
                count: 0 
            };
        }
        stats[key].count++;
    });

    // 2. ordeno de las mas usadas a las menos
    const sortedCategories = Object.entries(stats)
        .sort(([, a], [, b]) => b.count - a.count);

    console.log(`\nRESULTADO DEL ANÁLISIS: ${posts.length} artículos procesados.`);
    console.log('----------------------------------------------------------------');
    console.log('Podes usar este script para analizar');
    console.log('Copia el bloque de abajo y usalo en el script de migracion q vas hacer.');
    console.log('----------------------------------------------------------------\n');

    // 3. lo imprimo en formato de js ya lista para mapear
    sortedCategories.forEach(([key, info]) => {
        console.log(`    '${key}': { target: 'FIXME', enumCategory: 'FIXME' }, // (${info.count} posts) - Original: "${info.originalName}"`);
    });

    console.log('\n----------------------------------------------------------------');
    console.log('ayuda:');
    console.log('1. Copia las líneas de arriba.');
    console.log('2. Podes usarla en el scirpt para migrar, ya que tenes las noticias ordenadas y categorizadas, podes saber cuantas hay de cada categoria, y las q no tienen, podes repartirlas entre varias o incluso asignarlas todas a una.');
    console.log('3. Reemplaza el primer "FIXME" por "news" o "article".');
    console.log('4. Reemplaza el segundo "FIXME" por el nombre exacto de un enum del backend');
    console.log('4. Agregá un tercer "FIXME" por el nombre exacto de un conten hub del backend (esto en el caso de que sea un articulo, las noticias bastan con asignarles una categoria)');
    console.log(' VAS A TENER QUE CREAR UN ARCHIVO PARA MIGRAR TODO EL JSON A STRAPI. ADEMÁS, VAS A TENER Q AGARRAR EL .WPRESS Q ES LA COPIA DE SEGURIDAD Y EXTRAER LAS IMAGENES QUE TIENE, YA QUE EN EL JSON, FIJATE Q EL CAMPO MEDIA TIENE UNA URL DE VIVIR PLENAMENTE DE LA PAGINA VIEJA, POR LO QUE YA NO EXISTE, ASI QUE TENES Q EXTRAER LAS IMAGENES DE LA COPIA DE SEGURIDAD Y Q ESTEN EN TU PC, UNA VEZ SE MAPEA TODO AHI RECIEN PODEMOS ELIMINARLAS, OJO, ESTO PRIMERO SE PRUEBA EN LOCAL, Y LUEGO HABRA QUE EJECUTAR EST EMISMO SCRIPT PERO EN PRODUCCION, HAY Q PROBAR Q SE MAPEEN TODO BIEN.');
    
    

} catch (error) {
    console.error('Error:', error.message);
}