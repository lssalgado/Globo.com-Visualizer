var actual_page = 1;
var actual_element = 0;
var gcom_repos = 0;
var gcom_repos_array = [];
var gcom_repos_json = {};

function getReposData() {
    console.log(document.getElementById("repos_select").value);


}

function createSelect() {
    

    for (var i = 0; i < gcom_repos_array.length; i++) {
        var opt = gcom_repos_array[i].name;
        var ele = document.createElement("option");
        ele.textContent = opt;
        ele.value = opt;
        document.getElementById("repos_select").appendChild(ele);
    }
    
    var temp_opt = document.getElementById("temp_opt")
    temp_opt.parentNode.removeChild(temp_opt);

    getReposData();
}

function sortArrayAlphabetically() {
    gcom_repos_array.sort(function (a, b) {
        name_A = a.name.toLowerCase();
        name_B = b.name.toLowerCase();
        if (name_A < name_B) return -1;
        if (name_A > name_B) return 1;
        return 0;
    })
    createSelect();
}

function getRepos() {
    $.get("https://api.github.com/orgs/globocom/repos?page=" + actual_page + "&per_page=100", function (data) {

        data.forEach(function (element) {

            gcom_repos_json["name"] = element.name;
            gcom_repos_json["url"] = element.url;
            gcom_repos_json["commits_url"] = gcom_repos_json["url"] + "/stats/participation";
            gcom_repos_json["contributors_url"] = element.contributors_url;
            gcom_repos_array.push(gcom_repos_json);

            gcom_repos_json = {};
            actual_element++;

        }, this);

        if (actual_element == 100) {
            console.log(actual_element + "ok")
            actual_page++;
            actual_element = 0;
            getRepos();
        } else {
            console.log(actual_element + "falha");
            sortArrayAlphabetically();
        };
    });
}

function startPage() {

    var central_div = document.createElement("div");
    central_div.id = "central_div";
    central_div.className = "central_div";
    document.body.appendChild(central_div);

    var select = document.createElement("select");
    select.id = "repos_select"
    select.onchange = getReposData;
    document.getElementById("central_div").appendChild(select);

    var temp_opt = document.createElement("option");
    temp_opt.id = "temp_opt";
    temp_opt.textContent = "Carregando";
    document.getElementById("repos_select").appendChild(temp_opt);
    getRepos();
}