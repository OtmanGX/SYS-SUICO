var currentDate = moment();


// Charts

var $tensionChart = $('#tensionCanvas');
var ctx = $tensionChart[0].getContext("2d");
const dataTension = JSON.parse(JSON.stringify(data1));
var tensionChart = new Chart.Line(ctx, generateLineConfig('Tension (V)',dataTension, getAnnotations(LIMITS.TENSION.max, LIMITS.TENSION.theo), LIMITS.TENSION.max+1));

var $courantChart = $('#courantCanvas');
var ctx2 = $courantChart[0].getContext("2d");
const dataCourant = JSON.parse(JSON.stringify(data1));
var courantChart = new Chart.Line(ctx2, generateLineConfig('Courant (A)', dataCourant, getAnnotations(LIMITS.COURANT.max, LIMITS.COURANT.theo), LIMITS.COURANT.max+0.1));

var $puissanceChart = $('#puissanceCanvas');
var ctx3 = $puissanceChart[0].getContext("2d");
//const dataPuissance = data2;
const dataPuissance = JSON.parse(JSON.stringify(data1));
var puissanceChart = new Chart.Line(ctx3, generateLineConfig('Puissance (W)',
                                                            dataPuissance,
                                                            getAnnotations(LIMITS.PUISSANCE.max, LIMITS.PUISSANCE.theo), LIMITS.PUISSANCE.max+1));

var $puissanceDayChart = $('#puissanceDayChart');
var ctx4 = $puissanceDayChart[0].getContext("2d");
var puissanceDayChart = new Chart.Line(ctx4, generateLineConfig('Puissance (W)',
                                                            data2,
                                                            getAnnotations(LIMITS.PUISSANCE_TOT.max, LIMITS.PUISSANCE_TOT.theo),
                                                             LIMITS.PUISSANCE_TOT.max+1,
                                                              0, legend=true, showTitle=false));

// StackBar

var $stackedBarChart = $('#stackedBar');
var ctx = $stackedBarChart[0].getContext('2d');
configStackBar.options.annotations = getAnnotations(LIMITS.ENERGIE.max, LIMITS.ENERGIE.theo);
window.myBar = new Chart(ctx, configStackBar);
async function addDataStackBar(energieDay) {
    window.myBar.data.datasets[0].data = energieDay.map(x => x.phase1) ;
    window.myBar.data.datasets[1].data = energieDay.map(x => x.phase2) ;
    window.myBar.data.datasets[2].data = energieDay.map(x => x.phase3) ;
//    window.myBar.data.datasets[0].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7, 9, 11, 12, 13, 15, 16, 17, 20, 21, 21, 23, 24] ;
//    window.myBar.data.datasets[1].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7, 9, 11, 12, 13, 15, 16, 17, 20, 21, 21, 23, 24] ;
//    window.myBar.data.datasets[2].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7, 9, 11, 12, 13, 15, 16, 17, 20, 21, 21, 23, 24] ;
    window.myBar.update();
}
barChartData.labels = ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', ]
addDataStackBar(energieDay);

window.resetZoom = function (chart) {
    chart.resetZoom();
};


function resetZoomAll() {
    window.resetZoom(puissanceChart);
    window.resetZoom(courantChart);
    window.resetZoom(tensionChart);
}


function displayTime() {
    $("#timeValue").text(moment().format("DD-MM-Y HH:mm:ss"));
}

async function displayValues(data) {
    for (var i=1;i<4;i++) {
                    spans = $(`#phase${i}>li>span`);
                     spans[0].innerHTML = data[i-1].tension;
                     spans[1].innerHTML = data[i-1].courant;
                     spans[2].innerHTML = data[i-1].puissance;
                     spans[3].innerHTML = data[i-1].energie;
                     }
}

async function addToGraph(data, currentDate) {
    newValue(tensionChart, currentDate, data[0].tension, 0, false, true);
    newValue(tensionChart, currentDate, data[1].tension, 1, false, true);
    newValue(tensionChart, currentDate, data[2].tension, 2, false, true);
    tensionChart.update()

    newValue(courantChart, currentDate, data[0].courant, 0, false, true);
    newValue(courantChart, currentDate, data[1].courant, 1, false, true);
    newValue(courantChart, currentDate, data[2].courant, 2, false, true);
    courantChart.update();

    newValue(puissanceChart, currentDate, data[0].puissance, 0, false, true);
    newValue(puissanceChart, currentDate, data[1].puissance, 1, false, true);
    newValue(puissanceChart, currentDate, data[2].puissance, 2, false, true);
    puissanceChart.update();
}

var ajaxRealTime = async function () {
    $.ajax({
        url: "/realtime/",
        success: async function (data) {
            var data = data.data;
            if (data != null) {
                displayValues(data);
                var newCurrentDate = moment(data[3]);
                if (currentDate.isBefore(newCurrentDate)) {
                    currentDate = newCurrentDate;
                    addToGraph(data, currentDate);
                }
            }
        }
    });
};

async function ajaxPuissanceDay() {
    $.ajax({
        url: "/puissance/",
        success: async function (data) {
            clearChart(puissanceDayChart);
            await sleep(200);
            var data = data.puissanceDay;
            if (data != null) {
                $.each(data, function (i, d) {
                    newValue(puissanceDayChart, new Date(d.created_at), d.puissance, 0, false, false);
                });
                puissanceDayChart.update();
            }
        }
    });
};

async function ajaxEnergieDay() {
    $.ajax({
        url: "/energie/",
        success: async function (data) {
            clearChart(window.myBar);
            await sleep(200);
            var data = data.energieDay;
            if (data != null) {
                addDataStackBar(energieDay);
            }
        }
    });
};
// Intervals
var interval = 1000; // 1 secs
setInterval(displayTime, interval);
setInterval(ajaxRealTime, interval);

ajaxPuissanceDay();
