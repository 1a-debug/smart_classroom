// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('教学反馈页面加载完成');

    // 初始化筛选器
    initFilters();

    // 初始化建议标签
    initSuggestionTabs();

    // 加载教学反馈数据
    loadTeachingData();
});

// 初始化筛选器
function initFilters() {
    const datePicker = document.getElementById('datePicker');
    const classSelect = document.getElementById('classSelect');
    const teacherSelect = document.getElementById('teacherSelect');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // 分析按钮点击事件
    analyzeBtn.addEventListener('click', function () {
        const date = datePicker.value;
        const classId = classSelect.value;
        const teacherId = teacherSelect.value;
        loadTeachingData(date, classId, teacherId);
    });
}

// 加载教学反馈数据
function loadTeachingData(date, classId, teacherId) {
    // 显示加载状态
    showLoading();

    // 获取模拟数据
    const mockData = Data.getMockTeachingData();

    // 更新所有UI组件
    updateScoreCards(mockData.scores);
    updateTeachingSummary(mockData.summary);
    updateTeachingPieChart(mockData.teachingStats);
    updateTeachingLineChart(mockData.trendData);
    updateReactionPieChart(mockData.reactionStats);
    updateRadarChart(mockData.radarData);
    updateRhythmSection(mockData.rhythm);
    updateDetailsGrid(mockData.details);
    updateSuggestions(mockData.suggestions.immediate);
    updateHistoryChart(mockData.historyData);
}

// 更新评分卡片
function updateScoreCards(scores) {
    document.getElementById('overallScore').textContent = scores.overall;
    document.getElementById('attitudeScore').textContent = scores.attitude;
    document.getElementById('methodScore').textContent = scores.method;
    document.getElementById('interactionScore').textContent = scores.interaction;
    document.getElementById('languageScore').textContent = scores.language;

    // 更新进度条
    updateProgressBar('attitudeScore', scores.attitude);
    updateProgressBar('methodScore', scores.method);
    updateProgressBar('interactionScore', scores.interaction);
    updateProgressBar('languageScore', scores.language);
}

// 更新进度条
function updateProgressBar(id, value) {
    const card = document.getElementById(id).closest('.score-card');
    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = value + '%';
    }
}

// 更新教学概览
function updateTeachingSummary(summary) {
    document.getElementById('teachingTime').textContent = summary.teachingTime;
    document.getElementById('studentCount').textContent = summary.studentCount;
    document.getElementById('avgAttention').textContent = summary.avgAttention;
    document.getElementById('interactions').textContent = summary.interactions;
    document.getElementById('questionCount').textContent = summary.questionCount;
    document.getElementById('lectureTime').textContent = summary.lectureTime;
}

// 更新教学行为分布饼图
function updateTeachingPieChart(data) {
    const chart = echarts.init(document.getElementById('teachingPieChart'));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '教学行为',
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontWeight: 'bold'
                    }
                },
                data: data
            }
        ]
    };

    chart.setOption(option);
}

// 更新教学行为趋势折线图
function updateTeachingLineChart(data) {
    const chart = echarts.init(document.getElementById('teachingLineChart'));

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: 0,
            data: ['讲授', '板书', '提问', '解答', '巡视', '演示'],
            textStyle: {
                fontSize: 11
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timePoints,
            axisLabel: {
                fontSize: 10,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '时长(分钟)',
            nameTextStyle: {
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '讲授',
                type: 'line',
                data: data.lecture,
                smooth: true,
                lineStyle: { color: '#3b82f6', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '板书',
                type: 'line',
                data: data.blackboard,
                smooth: true,
                lineStyle: { color: '#10b981', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '提问',
                type: 'line',
                data: data.question,
                smooth: true,
                lineStyle: { color: '#f59e0b', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '解答',
                type: 'line',
                data: data.answer,
                smooth: true,
                lineStyle: { color: '#ef4444', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '巡视',
                type: 'line',
                data: data.walk,
                smooth: true,
                lineStyle: { color: '#8b5cf6', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '演示',
                type: 'line',
                data: data.demo,
                smooth: true,
                lineStyle: { color: '#ec4899', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            }
        ]
    };

    chart.setOption(option);
}

// 更新学生反应分布饼图
function updateReactionPieChart(data) {
    const chart = echarts.init(document.getElementById('reactionPieChart'));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '学生反应',
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontWeight: 'bold'
                    }
                },
                data: data
            }
        ]
    };

    chart.setOption(option);
}

// 更新教学效果雷达图
function updateRadarChart(data) {
    const chart = echarts.init(document.getElementById('radarChart'));

    const option = {
        tooltip: {},
        radar: {
            indicator: [
                { name: '知识掌握', max: 100 },
                { name: '课堂互动', max: 100 },
                { name: '思维启发', max: 100 },
                { name: '兴趣激发', max: 100 },
                { name: '方法创新', max: 100 },
                { name: '氛围营造', max: 100 }
            ],
            shape: 'circle',
            center: ['50%', '50%'],
            radius: '65%',
            name: {
                textStyle: {
                    fontSize: 11,
                    color: '#666'
                }
            }
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: data.values,
                        name: '教学效果',
                        areaStyle: {
                            color: 'rgba(59, 130, 246, 0.2)'
                        },
                        lineStyle: {
                            color: '#3b82f6',
                            width: 2
                        },
                        itemStyle: {
                            color: '#3b82f6'
                        }
                    }
                ]
            }
        ]
    };

    chart.setOption(option);
}

// 更新课堂节奏部分
function updateRhythmSection(rhythm) {
    // 这里可以动态更新节奏图的数据
    console.log('节奏数据:', rhythm);
}

// 更新教学细节网格
function updateDetailsGrid(details) {
    const grid = document.querySelector('.details-grid');
    if (!grid) return;

    grid.innerHTML = '';

    details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';

        const valueClass = detail.status === 'good' ? 'good' : 'warning';

        detailItem.innerHTML = `
            <div class="detail-header">
                <span class="detail-title">${detail.title}</span>
                <span class="detail-value ${valueClass}">${detail.value}</span>
            </div>
            <div class="detail-desc">${detail.desc}</div>
        `;

        grid.appendChild(detailItem);
    });
}

// 初始化建议标签
function initSuggestionTabs() {
    const tabs = document.querySelectorAll('.suggestion-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 更新激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 显示对应类型的建议
            const type = this.dataset.type;
            showSuggestionsByType(type);
        });
    });
}

// 根据类型显示建议
function showSuggestionsByType(type) {
    const mockData = Data.getMockTeachingData();
    let suggestions = [];

    switch (type) {
        case 'immediate':
            suggestions = mockData.suggestions.immediate;
            break;
        case 'shortterm':
            suggestions = mockData.suggestions.shortterm;
            break;
        case 'longterm':
            suggestions = mockData.suggestions.longterm;
            break;
    }

    updateSuggestions(suggestions);
}

// 更新建议列表
function updateSuggestions(suggestions) {
    const list = document.getElementById('suggestionsList');
    list.innerHTML = '';

    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        list.appendChild(li);
    });
}

// 更新历史评分趋势图
function updateHistoryChart(historyData) {
    const chart = echarts.init(document.getElementById('historyChart'));

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: historyData.dates,
            axisLabel: {
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            min: 70,
            max: 100,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '综合评分',
                type: 'line',
                data: historyData.scores,
                smooth: true,
                lineStyle: {
                    color: '#3b82f6',
                    width: 3
                },
                areaStyle: {
                    color: 'rgba(59, 130, 246, 0.1)'
                },
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };

    chart.setOption(option);
}

// 显示加载状态
function showLoading() {
    // 可以添加加载动画
    console.log('加载中...');
}

// 在 Data.js 中添加模拟数据
Data.getMockTeachingData = function () {
    return {
        scores: {
            overall: 92,
            attitude: 95,
            method: 88,
            interaction: 91,
            language: 94
        },

        summary: {
            teachingTime: 45,
            studentCount: 42,
            avgAttention: 86,
            interactions: 124,
            questionCount: 28,
            lectureTime: 32
        },

        teachingStats: [
            { name: '讲授', value: 320 },
            { name: '板书', value: 85 },
            { name: '提问', value: 45 },
            { name: '解答', value: 38 },
            { name: '巡视', value: 42 },
            { name: '演示', value: 28 }
        ],

        trendData: {
            timePoints: ['09:00', '09:05', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45'],
            lecture: [8, 7, 6, 5, 4, 3, 2, 1, 0, 0],
            blackboard: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
            question: [2, 1, 3, 2, 4, 2, 3, 1, 2, 1],
            answer: [1, 2, 1, 3, 2, 1, 2, 1, 1, 2],
            walk: [1, 1, 2, 1, 2, 2, 1, 1, 2, 1],
            demo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        },

        reactionStats: [
            { name: '专注', value: 320 },
            { name: '疑惑', value: 45 },
            { name: '理解', value: 280 },
            { name: '分心', value: 38 },
            { name: '疲倦', value: 25 }
        ],

        radarData: {
            values: [92, 88, 85, 90, 82, 88]
        },

        rhythm: {
            phases: [
                { name: '导入', start: 0, end: 7, intensity: 60 },
                { name: '讲授', start: 7, end: 18, intensity: 85 },
                { name: '互动', start: 18, end: 27, intensity: 90 },
                { name: '练习', start: 27, end: 36, intensity: 70 },
                { name: '总结', start: 36, end: 45, intensity: 50 }
            ]
        },

        details: [
            { title: '语言速度', value: '适中', status: 'good', desc: '平均语速 120字/分钟，适合学生理解' },
            { title: '板书频次', value: '偏少', status: 'warning', desc: '共板书8次，建议增加重点内容的板书' },
            { title: '提问分布', value: '均匀', status: 'good', desc: '提问覆盖了75%的学生，分布合理' },
            { title: '走动范围', value: '充分', status: 'good', desc: '讲台区域为主，偶尔走到学生中间' },
            { title: '手势使用', value: '丰富', status: 'good', desc: '手势自然，有助于学生理解' },
            { title: '眼神交流', value: '不足', status: 'warning', desc: '多注视后排学生，增强互动感' }
        ],

        suggestions: {
            immediate: [
                '增加板书频次，特别是重点公式和概念',
                '多与后排学生进行眼神交流',
                '提问后给学生更多思考时间'
            ],
            shortterm: [
                '设计更多小组讨论环节',
                '增加课堂小测，及时了解学生掌握情况',
                '引入多媒体教学工具，增强课堂趣味性'
            ],
            longterm: [
                '参加教学技能培训，提升教学方法',
                '建立学生反馈机制，定期收集意见',
                '开发特色教学案例库，丰富教学内容'
            ]
        },

        historyData: {
            dates: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
            scores: [85, 87, 86, 89, 88, 91, 90, 92]
        }
    };
};