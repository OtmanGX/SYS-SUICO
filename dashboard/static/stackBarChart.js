var barChartData = {
            labels: [],
			datasets: [{
				label: 'Phase 1',
				backgroundColor: window.chartColors.green,
				data: [
				]
			}, {
				label: 'Phase 2',
				backgroundColor: window.chartColors.orange,
				data: [
				]
			}, {
				label: 'Phase 3',
				backgroundColor: window.chartColors.blue,
				data: [
				]
			}]

		};




configStackBar = {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: barChartData,
    options: {
        annotation: {
                annotations: []
            },
        plugins: {
                    datalabels: {
                        align:'center',
                        display: true,
						borderColor: 'white',
		                color: 'black',
//						display: function(context) {
//							var dataset = context.dataset;
//							var count = dataset.data.length;
//							var value = dataset.data[context.dataIndex];
//							return value > count * 1.5;
//						},
//                        formatter: function(value, context) {
//							return value+'%';
//						},
                        anchor: 'center',
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
            padding: 5
        },
        legend: {
            display: false,
            labels: {
                // This more specific font property overrides the global property
                fontSize:12,
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
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
                scaleLabel: {
                display: true,
                labelString: 'Energie Wh',
        }
            }]
        }
    }
}

