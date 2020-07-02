doughnutLabelsConfig = window.dataLabelsConfig;
doughnutLabelsConfig.formatter = function(value, context) {
							return value+'%';
						};

doughnutLabelsConfig.display = function(context) {
    var dataset = context.dataset;
//    var count = dataset.data.length;
    var value = dataset.data[context.dataIndex];
    return value >= 5;
};

function generateConfig(title, data) {
    return {
			type: 'doughnut',
			plugins: [ChartDataLabels],
			data: {
				datasets: [{
				    borderColor: '#888A85',
				    borderWidth: 0,
					data: data,
					backgroundColor: [
						window.chartColors.green,
						window.chartColors.orange,
						window.chartColors.blue,
					],
					label: 'Pourcentages'
				}],
				labels: [
					'Phase 1',
					'Phase 2',
					'Phase 3',
				]
			},
			options: {
			    title: {
                    display: true,
                    position: 'bottom',
                    fontSize: 22,
                    text: title,
            },
			    layout: {
				padding: 2
			},
			    plugins: {
                    datalabels: doughnutLabelsConfig,
                },
//				responsive: true,
				legend: {
				    display: false  ,
					position: 'top',
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};
}

