// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('上课动作页面加载完成');

    // 初始化视频上传
    initVideoUpload();

    // 初始化过滤器
    initTimelineFilters();

    // 初始化排行榜标签
    initRankingTabs();
});

// 视频上传相关元素
const uploadArea = document.getElementById('uploadArea');
const videoInput = document.getElementById('videoInput');
const selectVideoBtn = document.getElementById('selectVideoBtn');
const videoInfo = document.getElementById('videoInfo');
const videoPreview = document.getElementById('videoPreview');
const videoName = document.getElementById('videoName');
const videoSize = document.getElementById('videoSize');
const videoDuration = document.getElementById('videoDuration');
const analyzeBtn = document.getElementById('analyzeVideoBtn');
const progressSection = document.getElementById('progressSection');
const actionSummary = document.getElementById('actionSummary');
const chartsRow = document.getElementById('chartsRow');
const timelineSection = document.getElementById('timelineSection');
const rankingSection = document.getElementById('rankingSection');

// 当前视频文件
let currentVideoFile = null;

// 初始化视频上传
function initVideoUpload() {
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', function (e) {
        if (e.target !== selectVideoBtn) {
            videoInput.click();
        }
    });

    // 点击选择视频按钮
    selectVideoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        videoInput.click();
    });

    // 文件选择事件
    videoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            handleVideoFile(file);
        }
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            handleVideoFile(file);
        } else {
            alert('请上传视频文件');
        }
    });

    // 开始分析按钮
    analyzeBtn.addEventListener('click', function () {
        startAnalysis();
    });
}

// 处理视频文件
function handleVideoFile(file) {
    currentVideoFile = file;

    // 显示视频信息
    videoName.textContent = file.name;
    videoSize.textContent = formatFileSize(file.size);

    // 创建视频预览
    const url = URL.createObjectURL(file);
    videoPreview.src = url;

    // 获取视频时长
    videoPreview.onloadedmetadata = function () {
        videoDuration.textContent = formatTime(videoPreview.duration);
    };

    // 隐藏上传区域，显示视频信息
    uploadArea.style.display = 'none';
    videoInfo.style.display = 'flex';
}

// 开始分析
function startAnalysis() {
    if (!currentVideoFile) return;

    // 隐藏视频信息，显示进度条
    videoInfo.style.display = 'none';
    progressSection.style.display = 'block';

    // 模拟分析过程
    simulateAnalysis();
}

// 模拟分析过程
function simulateAnalysis() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressStatus = document.getElementById('progressStatus');

    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // 分析完成
            progressStatus.textContent = '分析完成！';
            setTimeout(() => {
                showAnalysisResults();
            }, 500);
        }

        progressFill.style.width = progress + '%';
        progressPercent.textContent = Math.floor(progress) + '%';

        if (progress < 30) {
            progressStatus.textContent = '正在检测画面中的学生...';
        } else if (progress < 60) {
            progressStatus.textContent = '正在识别学生动作...';
        } else if (progress < 90) {
            progressStatus.textContent = '正在分析动作数据...';
        } else {
            progressStatus.textContent = '正在生成分析报告...';
        }
    }, 200);
}

// 显示分析结果
function showAnalysisResults() {
    // 隐藏进度条
    progressSection.style.display = 'none';

    // 显示各个结果区域
    actionSummary.style.display = 'block';
    chartsRow.style.display = 'grid';
    timelineSection.style.display = 'block';
    rankingSection.style.display = 'block';

    // 更新数据
    updateActionData();
}

// 更新动作数据
function updateActionData() {
    // 获取模拟数据
    const mockData = Data.getMockActionData();

    // 更新概览卡片
    document.getElementById('totalTime').textContent = mockData.totalTime;
    document.getElementById('handupCount').textContent = mockData.handupCount;
    document.getElementById('writingTime').textContent = mockData.writingTime;
    document.getElementById('readingTime').textContent = mockData.readingTime;
    document.getElementById('sleepingTime').textContent = mockData.sleepingTime;
    document.getElementById('speakingCount').textContent = mockData.speakingCount;
    document.getElementById('turnCount').textContent = mockData.turnCount;

    // 更新图表
    updateActionPieChart(mockData.actionStats);
    updateActionLineChart(mockData.trendData);
    updateTimeline(mockData.timeline);
    updateRanking(mockData.ranking);
}

// 更新动作分布饼图
function updateActionPieChart(data) {
    const chart = echarts.init(document.getElementById('actionPieChart'));

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
                name: '动作分布',
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

// 更新动作趋势折线图
function updateActionLineChart(data) {
    const chart = echarts.init(document.getElementById('actionLineChart'));

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: 0,
            data: ['举手', '写字', '阅读', '睡觉', '说话', '转头'],
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
                name: '举手',
                type: 'line',
                data: data.handup,
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
                name: '阅读',
                type: 'line',
                data: data.reading,
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
                name: '说话',
                type: 'line',
                data: data.speaking,
                smooth: true,
                lineStyle: { color: '#8b5cf6', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            },
            {
                name: '转头',
                type: 'line',
                data: data.turn,
                smooth: true,
                lineStyle: { color: '#ec4899', width: 2 },
                symbol: 'circle',
                symbolSize: 4
            }
        ]
    };

    chart.setOption(option);
}

// 更新时间轴
function updateTimeline(timelineData) {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    timelineData.forEach(item => {
        const timelineItem = createTimelineItem(item);
        container.appendChild(timelineItem);
    });
}

// 创建时间轴项目
function createTimelineItem(item) {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.dataset.action = item.action;

    // 确定动作标签的样式
    let actionClass = 'action-tag ';
    switch (item.action) {
        case '举手':
            actionClass += 'handup';
            break;
        case '写字':
            actionClass += 'writing';
            break;
        case '阅读':
            actionClass += 'reading';
            break;
        case '睡觉':
            actionClass += 'sleeping';
            break;
        case '说话':
            actionClass += 'speaking';
            break;
        case '转头':
            actionClass += 'turn';
            break;
    }

    // 计算持续时间占比
    const durationPercent = (item.duration / 600) * 100; // 假设总时长600秒

    div.innerHTML = `
        <span class="time-range">${item.start} - ${item.end}</span>
        <span class="student-name">${item.student}</span>
        <span class="${actionClass}">${item.action}</span>
        <div class="duration-bar">
            <div class="duration-fill" style="width: ${durationPercent}%"></div>
        </div>
        <span class="duration-value">${item.duration}秒</span>
    `;

    return div;
}

// 初始化时间轴过滤器
function initTimelineFilters() {
    const filters = document.querySelectorAll('.timeline-filter');

    filters.forEach(filter => {
        filter.addEventListener('click', function () {
            // 更新激活状态
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // 过滤时间轴
            const filterType = this.dataset.filter;
            filterTimeline(filterType);
        });
    });
}

// 过滤时间轴
function filterTimeline(filterType) {
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(item => {
        if (filterType === 'all' || item.dataset.action === filterType) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 更新排行榜
function updateRanking(rankingData) {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    // 默认显示举手排行榜
    showRankingByType('handup');
}

// 初始化排行榜标签
function initRankingTabs() {
    const tabs = document.querySelectorAll('.ranking-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 更新激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 显示对应排行榜
            const type = this.dataset.type;
            showRankingByType(type);
        });
    });
}

// 根据类型显示排行榜
function showRankingByType(type) {
    const rankingList = document.getElementById('rankingList');
    const mockData = Data.getMockActionData();

    let rankingData = [];
    let unit = '';
    let valueLabel = '';

    switch (type) {
        case 'handup':
            rankingData = mockData.ranking.handup;
            unit = '次';
            valueLabel = '举手次数';
            break;
        case 'writing':
            rankingData = mockData.ranking.writing;
            unit = '分钟';
            valueLabel = '写字时长';
            break;
        case 'speaking':
            rankingData = mockData.ranking.speaking;
            unit = '次';
            valueLabel = '说话次数';
            break;
        case 'sleeping':
            rankingData = mockData.ranking.sleeping;
            unit = '分钟';
            valueLabel = '睡觉时长';
            break;
    }

    rankingList.innerHTML = '';

    rankingData.forEach((item, index) => {
        const rankingItem = createRankingItem(item, index + 1, unit, valueLabel);
        rankingList.appendChild(rankingItem);
    });
}

// 创建排行榜项目
function createRankingItem(item, rank, unit, valueLabel) {
    const div = document.createElement('div');
    div.className = 'ranking-item';

    // 设置排名样式
    let rankClass = 'ranking-rank';
    if (rank === 1) rankClass += ' gold';
    else if (rank === 2) rankClass += ' silver';
    else if (rank === 3) rankClass += ' bronze';

    div.innerHTML = `
        <span class="${rankClass}">#${rank}</span>
        <img src="${item.avatar}" alt="${item.name}" class="ranking-avatar">
        <div class="ranking-info">
            <div class="ranking-name">${item.name}</div>
            <div class="ranking-detail">${valueLabel}</div>
        </div>
        <div>
            <span class="ranking-value">${item.value}</span>
            <span class="ranking-unit">${unit}</span>
        </div>
    `;

    return div;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 在 Data.js 中添加模拟数据
Data.getMockActionData = function () {
    return {
        totalTime: '45:30',
        handupCount: 42,
        writingTime: 18,
        readingTime: 12,
        sleepingTime: 5,
        speakingCount: 28,
        turnCount: 36,

        actionStats: [
            { name: '举手', value: 42 },
            { name: '写字', value: 180 },
            { name: '阅读', value: 120 },
            { name: '睡觉', value: 50 },
            { name: '说话', value: 28 },
            { name: '转头', value: 36 }
        ],

        trendData: {
            timePoints: ['09:00', '09:05', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45'],
            handup: [2, 3, 5, 4, 6, 3, 2, 4, 3, 2],
            writing: [5, 8, 12, 15, 18, 20, 22, 25, 23, 20],
            reading: [3, 4, 6, 8, 10, 12, 15, 14, 12, 8],
            sleeping: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8],
            speaking: [1, 2, 3, 2, 4, 3, 5, 4, 3, 2],
            turn: [2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
        },

        timeline: [
            { start: '00:12', end: '00:18', student: '张小明', action: '举手', duration: 6 },
            { start: '01:23', end: '03:45', student: '李小红', action: '写字', duration: 142 },
            { start: '03:45', end: '04:20', student: '王大力', action: '阅读', duration: 35 },
            { start: '04:20', end: '06:15', student: '赵小花', action: '写字', duration: 115 },
            { start: '06:15', end: '06:22', student: '陈小强', action: '举手', duration: 7 },
            { start: '07:30', end: '12:15', student: '刘小美', action: '睡觉', duration: 285 },
            { start: '12:15', end: '13:40', student: '张小明', action: '说话', duration: 85 },
            { start: '13:40', end: '15:20', student: '李小红', action: '转头', duration: 100 },
            { start: '15:20', end: '16:45', student: '王大力', action: '写字', duration: 85 },
            { start: '16:45', end: '17:30', student: '赵小花', action: '举手', duration: 45 }
        ],

        ranking: {
            handup: [
                { name: '张小明', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', value: 12 },
                { name: '李小红', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', value: 8 },
                { name: '王大力', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', value: 7 },
                { name: '赵小花', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', value: 5 },
                { name: '陈小强', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', value: 4 }
            ],
            writing: [
                { name: '李小红', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', value: 25 },
                { name: '王大力', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', value: 18 },
                { name: '张小明', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', value: 15 },
                { name: '赵小花', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', value: 12 },
                { name: '刘小美', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', value: 8 }
            ],
            speaking: [
                { name: '陈小强', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', value: 15 },
                { name: '刘小美', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', value: 12 },
                { name: '张小明', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', value: 8 },
                { name: '李小红', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', value: 5 },
                { name: '王大力', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', value: 3 }
            ],
            sleeping: [
                { name: '刘小美', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', value: 12 },
                { name: '陈小强', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', value: 8 },
                { name: '赵小花', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', value: 3 },
                { name: '王大力', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', value: 2 },
                { name: '张小明', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', value: 1 }
            ]
        }
    };
};