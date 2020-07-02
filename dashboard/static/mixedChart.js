var options = {
            plugins: {
                datalabels: {
                        align:'end',
                        display: true,
                        clamp: true,
                        clip: false,
                        backgroundColor: function(context) {
							return context.dataset.backgroundColor;
						},
						borderColor: 'black',
//						borderRadius: 20,
//						borderWidth: 2,
						visibility: true,
//						offset: 0,
//                        formatter: function(value, context) {
//							return value+'%';
//						},
                        anchor: 'bottom',
                        labels: {
                            title: {
                                font: {
                                    weight: 'bold',
                                    size: 12,
                                }
                            },
                        }
                    },
            },
            layout: {
				padding: 0
			},
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    // This more specific font property overrides the global property
                    fontSize:12,
//                    padding: 40
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            animation: {
					animateScale: true,
					animateRotate: true
				},
            responsive: true,
            scales: {
            yAxes: [{
                stacked: false,
                ticks: {
                max:60
                },
                scaleLabel: {
                display: true,
                    }
            }]
            }
        }



window.onload = function() {

    var $mixedChart = $('#mixedChart');
    var ctx = $mixedChart[0].getContext("2d");
    var mixedChart = new Chart(ctx, {
    type: 'bar',
    plugins: [ChartDataLabels,
    ],
    data: {
        datasets: [{
            label: 'Energie KWh',
            data: [10, 20, 30, 40],
            backgroundColor: color(presets.orange).alpha(0.5).rgbString(),
			borderColor: window.chartColors.orange,
        }, {
            label: 'Puissance W',
            data: [50, 30, 50, 40],
            fill: false,
            borderColor: window.chartColors.blue,
            pointRadius: 5,
//            lineTension: 0.5,
            type: 'line'
        }],
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi']
    },
    options: options
    });

}