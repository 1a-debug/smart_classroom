// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化筛选器
    initFilters();

    // 加载分析数据
    loadFeedbackData();
});

// 初始化筛选器
function initFilters() {
    const datePicker = document.getElementById('datePicker');
    const classSelect = document.getElementById('classSelect');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // 分析按钮点击事件
    analyzeBtn.addEventListener('click', function () {
        const date = datePicker.value;
        const classId = classSelect.value;
        loadFeedbackData(date, classId);
    });
}

// 加载反馈数据
function loadFeedbackData(date, classId) {
    showLoading();

    // 从API获取数据
    API.getFeedbackData(date, classId).then(data => {
        updateSummaryCards(data.summary);
        updateBehaviorPieChart(data.behaviorStats);
        updateBehaviorLineChart(data.trendData);
        updateTimeline(data.timeline);
        updateStudentsGrid(data.students);
        updateSuggestions(data.suggestions);
    }).catch(() => {
        // 使用模拟数据
        const mockData = Data.getMockFeedbackData();
        updateSummaryCards(mockData.summary);
        updateBehaviorPieChart(mockData.behaviorStats);
        updateBehaviorLineChart(mockData.trendData);
        updateTimeline(mockData.timeline);
        updateStudentsGrid(mockData.students);
        updateSuggestions(mockData.suggestions);
    });
}

// 更新概览卡片
function updateSummaryCards(summary) {
    document.getElementById('totalTime').textContent = summary.totalTime;
    document.getElementById('studentCount').textContent = summary.studentCount;
    document.getElementById('avgAttention').textContent = summary.avgAttention;
    document.getElementById('interactions').textContent = summary.interactions;
}

// 更新行为分布饼图
function updateBehaviorPieChart(data) {
    const chart = echarts.init(document.getElementById('behaviorPieChart'));

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
                name: '行为分布',
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

// 更新行为趋势折线图
// 更新行为趋势折线图和表格
function updateBehaviorLineChart(data) {
    // 更新折线图
    const lineChart = echarts.init(document.getElementById('behaviorLineChart'));

    const lineOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: false  // 隐藏图例，因为表格中已经有颜色标识
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
            boundaryGap: false,
            data: data.timePoints,
            axisLabel: {
                fontSize: 10,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '人数',
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
                name: '听课',
                type: 'line',
                data: data.listening,
                smooth: true,
                lineStyle: { color: '#3b82f6', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '写字',
                type: 'line',
                data: data.writing,
                smooth: true,
                lineStyle: { color: '#10b981', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '举手',
                type: 'line',
                data: data.handup,
                smooth: true,
                lineStyle: { color: '#f59e0b', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '睡觉',
                type: 'line',
                data: data.sleeping,
                smooth: true,
                lineStyle: { color: '#ef4444', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '其他',
                type: 'line',
                data: data.other,
                smooth: true,
                lineStyle: { color: '#8b5cf6', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            }
        ]
    };

    lineChart.setOption(lineOption);

    // 更新趋势表格
    updateTrendTable(data);
}

// 更新趋势表格
function updateTrendTable(data) {
    const tableBody = document.getElementById('trendTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // 遍历每个时间段
    for (let i = 0; i < data.timePoints.length; i++) {
        const row = document.createElement('tr');

        // 添加时间段
        row.innerHTML = `
            <td>${data.timePoints[i]}</td>
            <td><span class="behavior-value listening">${data.listening[i]}</span></td>
            <td><span class="behavior-value writing">${data.writing[i]}</span></td>
            <td><span class="behavior-value handup">${data.handup[i]}</span></td>
            <td><span class="behavior-value sleeping">${data.sleeping[i]}</span></td>
            <td><span class="behavior-value other">${data.other[i]}</span></td>
        `;

        tableBody.appendChild(row);
    }
}

// 更新时间轴
function updateTimeline(timelineData) {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    timelineData.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        // 确定行为标签的样式
        let behaviorClass = 'behavior-tag ';
        switch (item.behavior) {
            case '听课':
                behaviorClass += 'listening';
                break;
            case '写字':
                behaviorClass += 'writing';
                break;
            case '举手':
                behaviorClass += 'handup';
                break;
            case '睡觉':
                behaviorClass += 'sleeping';
                break;
            default:
                behaviorClass += 'other';
        }

        // 计算持续时间占整个视频的比例（用于进度条）
        const durationPercent = (item.duration / 300) * 100; // 假设视频总长300秒

        timelineItem.innerHTML = `
            <span class="time-range">${item.start} - ${item.end}</span>
            <span class="${behaviorClass}">${item.behavior}</span>
            <div class="duration-bar">
                <div class="duration-fill" style="width: ${durationPercent}%"></div>
            </div>
            <span class="duration-value">${item.duration}秒</span>
        `;

        container.appendChild(timelineItem);
    });
}

// 更新学生卡片网格
function updateStudentsGrid(students) {
    const grid = document.getElementById('studentsGrid');
    grid.innerHTML = '';

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';

        card.innerHTML = `
            <img src="${student.avatar}" alt="${student.name}" class="student-avatar">
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-behavior">主要行为: ${student.mainBehavior}</div>
                <div class="student-attention">
                    <span class="attention-bar">
                        <span class="attention-fill" style="width: ${student.attention}%"></span>
                    </span>
                    <span class="attention-value">${student.attention}%</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// 更新教学建议
function updateSuggestions(suggestions) {
    const container = document.getElementById('suggestions');
    container.innerHTML = '<ul>' + suggestions.map(s => `<li>${s}</li>`).join('') + '</ul>';
}

// 显示加载状态
function showLoading() {
    // 可以在这里添加加载动画
}

// 在 Data.js 中添加模拟数据
Data.getMockFeedbackData = function () {
    return {
        summary: {
            totalTime: '45:30',
            studentCount: 32,
            avgAttention: 85,
            interactions: 156
        },
        behaviorStats: [
            { name: '听课', value: 1250 },
            { name: '写字', value: 350 },
            { name: '举手', value: 45 },
            { name: '睡觉', value: 20 },
            { name: '其他', value: 85 }
        ],
        trendData: {
            timePoints: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'],
            listening: [25, 28, 22, 20, 18, 15, 12, 10],
            writing: [5, 8, 12, 15, 18, 20, 22, 25],
            handup: [2, 3, 1, 4, 2, 5, 3, 2],
            sleeping: [1, 0, 2, 3, 4, 5, 6, 8],
            other: [1, 1, 2, 1, 2, 1, 1, 2]
        },
        timeline: [
            { start: '00:00', end: '05:23', behavior: '听课', duration: 323 },
            { start: '05:23', end: '12:45', behavior: '写字', duration: 442 },
            { start: '12:45', end: '15:30', behavior: '举手', duration: 165 },
            { start: '15:30', end: '20:15', behavior: '听课', duration: 285 },
            { start: '20:15', end: '28:40', behavior: '写字', duration: 505 },
            { start: '28:40', end: '35:20', behavior: '睡觉', duration: 400 },
            { start: '35:20', end: '38:10', behavior: '其他', duration: 170 },
            { start: '38:10', end: '45:30', behavior: '听课', duration: 440 }
        ],
        students: [
            { name: '张小明', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', mainBehavior: '听课', attention: 92 },
            { name: '李小红', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', mainBehavior: '写字', attention: 88 },
            { name: '王大力', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', mainBehavior: '举手', attention: 95 },
            { name: '赵小花', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', mainBehavior: '听课', attention: 78 },
            { name: '陈小强', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', mainBehavior: '睡觉', attention: 45 },
            { name: '刘小美', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', mainBehavior: '其他', attention: 70 }
        ],
        suggestions: [
            '课堂专注度整体良好，但第3节有下降趋势，建议增加互动环节',
            '有3名学生频繁出现睡觉行为，建议关注其课堂状态',
            '举手次数较少，可以多鼓励学生提问',
            '写字行为集中在课程后半段，可适当调整板书时间',
            '建议在课程中段加入5分钟休息或互动环节，提高注意力'
        ]
    };
};