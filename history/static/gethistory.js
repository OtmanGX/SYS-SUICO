months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
monthsIds = months.map(x=>'doughnut'+x)

//var $doughnutChart = $('#doughnutJanvier');
//var ctx = $doughnutChart[0].getContext('2d');
//window.myDoughnut = new Chart(ctx, generateConfig('janv.', [10, 80, 10]));


function generateDoughnuts() {
    var doughnuts = document.getElementById('doughnuts');
    monthsIds.forEach((value, index) =>
    {
        var canvas = document.createElement('CANVAS');
        canvas.setAttribute('id', value);
        canvas.setAttribute('class', 'col-2 p-0');
        canvas.setAttribute('height', 200);
        doughnuts.appendChild(canvas);
        var ctx = canvas.getContext('2d');
//        eval(value+'='+'new Chart(ctx, generateConfig(months[index], [10, 80, 10]));');
        new Chart(ctx, generateConfig(months[index], [10, 80, 10]));
    });
}

generateDoughnuts();


// StackBar
var $stackedBarChart = $('#stackedBar');
var ctx = $stackedBarChart[0].getContext('2d');
window.myBar = new Chart(ctx, configStackBar);
async function addDataStackBar() {
//    window.myBar.data.datasets[0].data = energieDay.map(x => x.phase1) ;
//    window.myBar.data.datasets[1].data = energieDay.map(x => x.phase2) ;
//    window.myBar.data.datasets[2].data = energieDay.map(x => x.phase3) ;
    window.myBar.data.datasets[0].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7] ;
    window.myBar.data.datasets[1].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7] ;
    window.myBar.data.datasets[2].data = [4,5, 7, 9, 11, 12, 13, 15, 16, 4,5, 7] ;

    window.myBar.update();
}
barChartData.labels = months
addDataStackBar();