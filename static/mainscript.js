var unit = 'second';
var date = moment();
//var timeFormat = 'MM/DD/YYYY hh:mm a';
var timeFormat = 'LLL';
var now = window.moment();
var dragOptions = {
    animationDuration: 500
};
var color = Chart.helpers.color;
var numberElements = 50;
//var fixedData = LIMITS;
var updateCount = 0;


function unitLessThanDay() {
    return unit === 'second' || unit === 'minute' || unit === 'hour';
}

function beforeNineThirty(date) {
    return date.hour() < 9 || (date.hour() === 9 && date.minute() < 30);
}

function outsideMarketHours(date) {
    if (date.isoWeekday() > 5) {
        return true;
    }
    if (unitLessThanDay() && (beforeNineThirty(date) || date.hour() > 16)) {
        return true;
    }
    return false;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
    var open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
    var close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
    return {
        t: date.valueOf(),
        y: close
    };
}

function generateData() {
    // var date = moment('Jan 01 1990', 'MMM DD YYYY');
    var date = moment();
    date.add(2, unit);
    var now = moment();
    var data = [];
    var lessThanDay = unitLessThanDay();
    for (; data.length < 100; date = date.clone().add(1, unit).startOf(unit)) {
        if (outsideMarketHours(date)) {
            if (!lessThanDay || !beforeNineThirty(date)) {
                date = date.clone().add(date.isoWeekday() >= 5 ? 8 - date.isoWeekday() : 1, 'day');
            }
            if (lessThanDay) {
                date = date.hour(9).minute(30).second(0);
            }
        }
        console.log(date)
        data.push(randomBar(date, 10));
    }
    return data;
}

function generateOneData() {
    date.add(1, unit);
    return randomBar(date, 10);
}

// Annotations
function getAnnotations(max, theo) {
    return [{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: max,
    borderColor: presets.red,
    borderWidth: 3,
    label: {
        enabled: true,
        content: 'max',
        position: "left",
    }
},{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: theo,
    borderColor: presets.purple,
    borderWidth: 3,
    label: {
        enabled: true,
        content: 'Théorique',
        position: "left"
    }
}]
}

var data1 = {
    datasets: [{
        borderColor: presets.green,
        pointRadius: 2,
        lineTension: 0.3,
        borderWidth: 2,
        data: [],
        label: 'Phase 1',
        fill: false,
    }, {
        borderColor: presets.orange,
        label: 'Phase 2',
        pointRadius: 2,
        lineTension: 0.3,
        borderWidth: 2,
        data: [],
        fill: false
    }, {
        borderColor: presets.blue,
        label: 'Phase 3',
        pointRadius: 2,
        lineTension: 0.3,
        borderWidth: 2,
        data: [],
        fill: false
    }]
}

var data2 = {
    datasets: [{
        borderColor: presets.green,
        pointRadius: 0,
        lineTension: 0,
        borderWidth: 2,
        data: [],
        label: 'Puissance Totale',
        fill: false,
    }]
}

//data2 = JSON.parse(JSON.stringify(data1));
//data2.datasets.push({
//        borderColor: presets.yellow,
//        label: 'Puissance totale',
//        pointRadius: 2,
//        lineTension: 0.3,
//        borderWidth: 2,
//        data: [],
//        fill: false
//    })


function generateLineConfig(title, data, annotations, max, duration=400, legend=false, showTitle=true) {
    var config =  {
        type: 'line',
        data: data,
        options: {
            annotation: {
                annotations: annotations
            },
            legend: {
                display: legend,
            },
            showLine: false,
            responsive: true,
            title: {
                display: showTitle   ,
                fontSize: 16,
                text: title,
            },
            animation: {
                duration: duration
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    type: 'time',
                    time: {
                        parser: timeFormat,
                        displayFormats: {
                        millisecond: 'H:mm:ss',
                        second: 'H:mm:ss',
                        minute: 'H:mm',
                        hour: 'H',
                         },
                        // round: 'day'
                        tooltipFormat: 'll H:mm:ss'
                    },
                    distribution: 'linear',
                    offset: true,
                    ticks: {
                        autoSkip: true,
                        beginAtZero: false,
                        autoSkipPadding: 20,
                        major: {
                            enabled: true,
                            fontStyle: 'bold'
                        },
//                        source: 'data',
//                        autoSkip: true,
//                        beginAtZero: true,
//                        autoSkipPadding: 75,
                        minRotation: 0,
                        maxRotation: 0,
                    },
                }],
                yAxes: [{
//                    sampleSize: 10,
//                    stepSize: 1,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    stacked: false,
                    ticks: {
                        autoSkip: true,
                        autoSkipPadding: 10,
//                        stepSize: 1,
//                        suggestedMin: fixedData[0]-2,
                        suggestedMax: max
                    },
                    display: true,
                    type: 'linear',
                    scaleLabel: {
                        display: false,
//                        labelString: 'Température',
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'nearest',
//                callbacks: {
//                    label: function (tooltipItem, myData) {
//                        var label = myData.datasets[tooltipItem.datasetIndex].label || '';
//                        if (label) {
//                            label += ': ';
//                        }
//                        label += parseFloat(tooltipItem.value).toFixed(2);
//                        return label;
//                    }
//                }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            plugins: {
                ChartDataLabels: false,
                zoom: {
                    pan: {
                        // Boolean to enable panning
                        enabled: true,

                        // Panning directions. Remove the appropriate direction to disable
                        // Eg. 'y' would only allow panning in the y direction
                        mode: 'x'
                },
                    zoom: {
                        drag: false,
                        enabled: true,
//                        drag: dragOptions,
                        mode: 'x',
                        // Minimal zoom distance required before actually applying zoom
                        threshold: 10,

                        // On category scale, minimal zoom level before actually applying zoom
                        sensitivity: 15,
                        speed: 0.15
                    }
                }
            },
        },
    }
    return config
}

var colorNames = Object.keys(window.chartColors);


function addData(chart, data, i = 4, update = true) {
//    chart.data.datasets.forEach((dataset) => {
//        dataset.data.push(data);
//    });
    chart.data.datasets[i].data.push(data);
    if (update) chart.update();
}

function newValue(chart, date, value, i = 4, update = true, shift=false) {
    if (shift)
        if (updateCount > numberElements) {
            chart.data.labels.shift();
            chart.data.datasets[i].data.shift();
        } else updateCount++;
    addData(chart, {
        t: date.valueOf(),
        y: value
    }, i, update);

}

function newValue2(chart) {
    var array = new Array();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 12; j++)
            addData(chart, {
                t: new Date(year = 2020, month = j),
                y: fixedData[i]
            }, i, true);
    chart.update()
}


function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function addDataIntervall() {
    dd = generateOneData();
    addData(chart, dd);
}

window.resetZoom = function (chart) {
    chart.resetZoom();
};

window.clearChart = async function (chart) {
    console.log("clear called");
//    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
};


function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
