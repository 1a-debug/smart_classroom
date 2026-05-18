function initCharts() {

    var lineChart = echarts.init(document.getElementById('lineChart'));

    lineChart.setOption({

        tooltip: {},

        xAxis: {
            type: 'category',
            data: ['20', '30', '40', '50', '60']
        },

        yAxis: {
            type: 'value'
        },

        series: [{

            data: [120, 90, 150, 80, 170],
            type: 'line',
            smooth: true

        }]

    });


    var barChart = echarts.init(document.getElementById('barChart'));

    barChart.setOption({

        tooltip: {},

        xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7']
        },

        yAxis: {
            type: 'value'
        },

        series: [{

            data: [80, 100, 140, 160, 120, 110, 90],
            type: 'bar'

        }]

    });

}

initCharts();