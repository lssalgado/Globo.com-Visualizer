var url_repos_Gcom = "https://api.github.com/repos/globocom/";
var actual_page = 1;
var actual_element = 0;
var gcom_repos = 0;
var gcom_repos_array = [];
var gcom_repos_json = {};
var star_amount = 0;
var fork_amount = 0;
var contributors_amount = 0;
var commits_per_week = [];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
var commits_per_month = [];
var month_list = [];
var myChart = {};
var week = {};
var actual_month = 0;
var actual_month_name = "";
var commit_counter = 0;

var ctx = document.getElementById("myChart");

function defineChartData() {

    var actual_month = moment().month();
    var actual_month_name = monthNames[actual_month] + "/" + moment().year();
    var commit_counter = 0;
    console.log(commits_per_week)

    var size = commits_per_week.length;

    commit_counter = commit_counter + commits_per_week[commits_per_week.length - 1];

    for (i = commits_per_week.length - 1; i > 0; i--) {

        commit_counter = commit_counter + commits_per_week[i - 1];
        week = moment(moment().subtract((commits_per_week.length - i), 'weeks').calendar());

        if (week.month() != actual_month) {
            console.log("Month -> " + week.month())

                commits_per_month.unshift(commit_counter);
                month_list.unshift(actual_month_name);

                commit_counter = 0;
                actual_month = week.month();
                actual_month_name = monthNames[actual_month]+ "/" + week.year();

        }


    }

    console.log(commits_per_month);
    console.log(month_list);

}

function feedPage() {

    myChart = {};

    document.getElementById("stars").textContent = "Stars: " + star_amount;
    document.getElementById("forks").textContent = "Forks: " + fork_amount;
    document.getElementById("contributors").textContent = "Contributors: " + contributors_amount;

    defineChartData();

    var ctx = document.getElementById("myChart");
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: month_list,
            datasets: [{
                label: 'Commits mensais',
                data: commits_per_month,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
    });


}

function getReposData() {

    reposToGet = document.getElementById("repos_select").value;
    console.log(reposToGet);

    $.get(url_repos_Gcom + reposToGet, function (data) {
        star_amount = data.stargazers_count;
        fork_amount = data.forks;
    })
        .done(function () {
            contributors_amount = 0;
            $.get(url_repos_Gcom + reposToGet + "/contributors", function (data) {
                if ($.isEmptyObject(data)) {
                    contributors_amount = 0;
                } else {
                    data.forEach(function () {
                        contributors_amount++;
                    });
                }
            })
                .done(function () {
                    console.log("contributors_amount = " + contributors_amount);

                    $.get(url_repos_Gcom + reposToGet + "/stats/participation", function (data) {
                        commits_per_week = data.all;
                        console.log(commits_per_week);
                    })
                        .done(function () {
                            feedPage();
                        })
                });
        });





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

    document.getElementById("repos_select").onchange = getReposData;
    getRepos();
}