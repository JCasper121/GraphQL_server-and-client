function getLanguagesQuery() {
    return `{
        languages {
            id
            name
            imageUrl
        }
    }`
}

function getFrameworksQuery() {
    return `{
        frameworks {
            id
            name
            imageUrl
        }
    }`
}

function getCategoriesQuery() {
    return `{
        categories {
            id
            name
            imageUrl
        }
    }`
}

function getLanguagesByFrameworkIdQuery(id) {
    return `{
        framework(id: ${id}) {
            id
            name
            language {
                id
                name
                imageUrl
            }
        }
    }`
}

function getFrameworksByLanguageIdQuery(id) {
    return `{
        language(id: ${id}) {
            id
            name
            imageUrl
            frameworks {
                id
                name
                imageUrl
            }
        }
    }`
}

function getFrameworksByCategoryIdQuery(id) {
    return `{
        category(id: ${id}) {
            id
            name
            frameworks {
                id
                name
                imageUrl
            }
        }
    }`
}

async function getFrameworks() {
    const query = getFrameworksQuery();
    const data = await sendRequest(query);
    const frameworks = data.frameworks;

    $("#heading").text("Frameworks");
    $("#data").empty();

    for(i = 0; i < frameworks.length; i++){
        $("#data").append(`
        <div class="framework" onclick="getLanguageByFrameworkId(${frameworks[i].id})">
            <h4 class="framework-name">${frameworks[i].name}</h4>
            <img class="framework-img" src="${frameworks[i].imageUrl}" alt="Framework Image"/>
        </div>
    `);
    }
}

async function getLanguages() {
    const query = getLanguagesQuery();
    const data = await sendRequest(query);
    const languages = data.languages;

    
    $("#heading").text("Langauges");
    $("#data").empty();

    for(i = 0; i < languages.length; i++){
        //console.log("Framework: " + frameworks[i].name + frameworks[i].id + frameworks[i].imageUrl);
        $("#data").append(`
        <div class="framework" onclick="getFrameworksByLanguageId(${languages[i].id})">
            <h4 class="framework-name">${languages[i].name}</h4>
            <img class="framework-img" src="${languages[i].imageUrl}" alt="Languages Image"/>
        </div>
    `);
    }
}

async function getLanguageByFrameworkId(id){
    const query = getLanguagesByFrameworkIdQuery(id);
    const data = await sendRequest(query);
    const language = data.framework.language;
    
    $("#heading").text(`${data.framework.name} uses ${data.framework.language.name}`);
    $("#data").empty();
        //console.log("Framework: " + frameworks[i].name + frameworks[i].id + frameworks[i].imageUrl);
    $("#data").append(`
        <div class="framework" onclick="getFrameworksByLanguageId(${language.id})">
            <h4 class="framework-name">${language.name}</h4>
            <img class="framework-img" src="${language.imageUrl}" alt="Languages Image"/>
        </div>
    `);
}

async function getFrameworksByLanguageId(id) {
    const query = getFrameworksByLanguageIdQuery(id);


    const data = await sendRequest(query);

    const frameworks = data.language.frameworks;
    const language = data.language;
    
    $("#heading").text(`${language.name} is used in:`);
    $("#data").empty();

    for(i = 0; i < frameworks.length; i++){
        //console.log("Framework: " + frameworks[i].name + frameworks[i].id + frameworks[i].imageUrl);
        $("#data").append(`
        <div class="framework" onclick="getLanguageByFrameworkId(${frameworks[i].id})">
            <h4 class="framework-name">${frameworks[i].name}</h4>
            <img class="framework-img" src="${frameworks[i].imageUrl}" alt="Languages Image"/>
        </div>
    `);
    }
}

async function getCategories() {
    const query = getCategoriesQuery();
    const data = await sendRequest(query);
    const categories = data.categories;
    
    $("#heading").text(`Categories`);
    $("#data").empty();

    for(i = 0; i < categories.length; i++){
        //console.log("Framework: " + frameworks[i].name + frameworks[i].id + frameworks[i].imageUrl);
        $("#data").append(`
        <div class="framework" onclick="getFrameworksByCategoryId(${categories[i].id})">
            <h4 class="framework-name">${categories[i].name}</h4>
            <img class="framework-img" src="${categories[i].imageUrl}"/>
        </div>
    `);
    }
}

async function getFrameworksByCategoryId(id){
    const query = getFrameworksByCategoryIdQuery(id);
    const data = await sendRequest(query);
    const frameworks = data.category.frameworks;
    console.log("Frameworks: ", data);
    $("#heading").text(`${data.category.name} Includes:`);
    $("#data").empty();

    for(i = 0; i < frameworks.length; i++){
        //console.log("Framework: " + frameworks[i].name + frameworks[i].id + frameworks[i].imageUrl);
        $("#data").append(`
        <div class="framework" onclick="getLanguageByFrameworkId(${frameworks[i].id})">
            <h4 class="framework-name">${frameworks[i].name}</h4>
            <img class="framework-img" src="${frameworks[i].imageUrl}" alt="Languages Image"/>
        </div>
    `);
    }
}

async function addCategoryForm() {
    console.log("Add category");
    $("#data").empty();
    $("#data").append(`
    <h1>Add a Category</h1>
        <div class="form-group">
            <label for="category-name">Category Name:</label>
            <input type="text" id="category-name"/>
        </div>
        <div class="form-group">
            <label for="category-imageUrl">Image Url:</label>
            <input type="text" id="category-imageUrl"/>
        </div>
        <button onclick="addCategory()">Submit</button>
    `)
}

async function addLanguageForm() {
    $("#data").empty();
    $("#data").append(`
    <h1>Add a Language</h1>
        <div class="form-group">
            <label for="language-name">Language Name:</label>
            <input type="text" id="language-name"/>
        </div>
        <div class="form-group">
            <label for="language-imageUrl">Image Url:</label>
            <input type="text" id="language-imageUrl"/>
        </div>
        <button onclick="addLanguage()">Submit</button>
    `)
}

async function addFrameworkForm() {
    const data = await sendRequest(getLanguagesQuery())
    const cats = await sendRequest(getCategoriesQuery());
    var langOptions = ``;
    for(i = 0; i < data.languages.length; i++) {
        langOptions += `<option value="${data.languages[i].id}">${data.languages[i].name}</option>`;
    }

    var catOptions = ``;
    for(i = 0; i < cats.categories.length; i++){
        catOptions += `<option value="${cats.categories[i].id}">${cats.categories[i].name}</option>`;
        console.log("cat options: ", catOptions);
    }
    // console.log("CAt options: ", catOptions);
    $("#data").empty();
    $("#data").append(`
    <h1>Add a Framework</h1>
        <div class="form-group">
            <label for="framework-name">Framework Name:</label>
            <input type="text" id="framework-name"/>
        </div>
        <div class="form-group">
            <label for="select-language">Select language: </label>
            <select id="select-language">
                ${langOptions}
            </select>
        </div>
        <div class="form-group">
            <label for="select-category">Select category: </label>
            <select id="select-category">
                ${catOptions}
            </select>
        </div>
        <div class="form-group">
            <label for="framework-imageUrl">Image Url:</label>
            <input type="text" id="framework-imageUrl"/>
        </div>
        <button onclick="addFramework()">Submit</button>
    `)
}

async function addCategory() {
    const name = $("#category-name").val();
    const imageUrl = $("#category-imageUrl").val();
    const query = ` mutation { 
        addCategory(name: "${name}", imageUrl: "${imageUrl}") {
            id
            name
            imageUrl
        }
    }`
    sendRequest(query);
}

async function addFramework() {
    console.log("In add framework");
    const name = $("#framework-name").val();
    const languageId = $("#select-language").val();
    const imageUrl = $("#framework-imageUrl").val();
    const category = $("#select-category").val();

    const query = ` mutation {
        addFramework(name: "${name}", languageId: ${languageId}, imageUrl: "${imageUrl}", categoryId: ${category}){
            id
            name
        }
    }`
    sendRequest(query);
}

async function addLanguage() {
    console.log("In add language");
    const name = $("#language-name").val();
    const imageUrl  = $("#language-imageUrl").val();
    const query = ` mutation {
        addLanguage(name: "${name}", imageUrl: "${imageUrl}") {
            id
            name
        }
    }`
    sendRequest(query);
}
// async function getFramework(id) {
//     const query = `{
//         framework(id: ${id}) {
//             id
//             name
//             imageUrl
//             language {
//                 id
//                 name
//                 imageUrl
//             }
//         }
//     }`
//     await sendRequest(query);
// }

// async function getLanguage(id) {
//     const query = `{
//         language(id: ${id}) {
//             id
//             name
//             imageUrl
//             frameworks {
//                 id
//                 name
//             }
//         }
//     }`
//     await sendRequest(query);
// }




async function sendRequest(query) {
    console.log("Query: ", query);
    var result = [];
    await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
        })
    .then(res => res.json())
    .then(json => {
        console.log("In then");
        console.log(json.data);
        result = json.data;
    });
    return result;
    // return result
}

window.onload = () => {
    console.log("Document loaded.")

}