// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('发现管理页面加载完成');

    // 初始化筛选器
    initFilters();

    // 初始化标签页
    initTabs();

    // 初始化模态框
    initModal();

    // 加载发现管理数据
    loadManageData();
});

// 当前选中的问题
let selectedIssues = [];
let currentPage = 1;
const pageSize = 10;

// 初始化筛选器
function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');

    // 设置默认日期
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    document.getElementById('startDate').value = sevenDaysAgo.toISOString().split('T')[0];

    // 筛选按钮点击事件
    filterBtn.addEventListener('click', function () {
        loadManageData();
    });

    // 搜索输入（防抖）
    let searchTimer;
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            loadManageData();
        }, 500);
    });

    // 导出按钮
    exportBtn.addEventListener('click', function () {
        exportData();
    });
}

// 初始化标签页
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 更新标签页激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 显示对应内容
            const tabId = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + 'Tab').classList.add('active');

            // 如果是统计分析标签页，加载统计数据
            if (tabId === 'statistics') {
                loadStatisticsData();
            }
        });
    });
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('issueModal');
    const closeBtn = document.querySelector('.close-modal');

    // 关闭模态框
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 处理按钮
    document.getElementById('markProcessing').addEventListener('click', function () {
        updateIssueStatus('processing');
    });

    document.getElementById('markResolved').addEventListener('click', function () {
        updateIssueStatus('resolved');
    });
}

// 加载发现管理数据
function loadManageData() {
    // 显示加载状态
    showLoading();

    // 获取模拟数据
    const mockData = Data.getMockManageData();

    // 更新统计卡片
    updateAlertStats(mockData.stats);

    // 更新图表
    updateTrendChart(mockData.trendData);
    updateTypeChart(mockData.typeData);

    // 更新问题列表
    updateIssuesList(mockData.issues);

    // 更新时间轴
    updateTimeline(mockData.records);

    // 更新分页
    updatePagination(mockData.totalCount);
}

// 更新预警统计卡片
function updateAlertStats(stats) {
    document.getElementById('pendingAlerts').textContent = stats.pending;
    document.getElementById('criticalIssues').textContent = stats.critical;
    document.getElementById('normalIssues').textContent = stats.normal;
    document.getElementById('resolvedIssues').textContent = stats.resolved;
}

// 更新趋势图
function updateTrendChart(data) {
    const chart = echarts.init(document.getElementById('trendChart'));

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
            data: data.dates,
            axisLabel: {
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '发现问题',
                type: 'line',
                data: data.issues,
                smooth: true,
                lineStyle: {
                    color: '#ef4444',
                    width: 2
                },
                areaStyle: {
                    color: 'rgba(239, 68, 68, 0.1)'
                },
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: '已解决',
                type: 'line',
                data: data.resolved,
                smooth: true,
                lineStyle: {
                    color: '#10b981',
                    width: 2
                },
                areaStyle: {
                    color: 'rgba(16, 185, 129, 0.1)'
                },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    };

    chart.setOption(option);
}

// 更新类型分布图
function updateTypeChart(data) {
    const chart = echarts.init(document.getElementById('typeChart'));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: {
                fontSize: 11
            }
        },
        series: [
            {
                name: '问题类型',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: data
            }
        ]
    };

    chart.setOption(option);
}

// 更新问题列表
function updateIssuesList(issues) {
    const list = document.getElementById('issuesList');
    list.innerHTML = '';

    // 获取筛选条件
    const statusFilter = document.getElementById('issueStatusFilter').value;
    const levelFilter = document.getElementById('issueLevelFilter').value;

    // 过滤问题
    let filteredIssues = issues;
    if (statusFilter !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.status === statusFilter);
    }
    if (levelFilter !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.level === levelFilter);
    }

    // 分页
    const start = (currentPage - 1) * pageSize;
    const paginatedIssues = filteredIssues.slice(start, start + pageSize);

    paginatedIssues.forEach(issue => {
        const issueItem = createIssueItem(issue);
        list.appendChild(issueItem);
    });

    // 更新分页
    updatePagination(filteredIssues.length);
}

// 创建问题项
function createIssueItem(issue) {
    const div = document.createElement('div');
    div.className = `issue-item ${issue.level}`;

    // 获取图标
    let icon = '⚠️';
    if (issue.type === 'attention') icon = '👀';
    else if (issue.type === 'behavior') icon = '👋';
    else if (issue.type === 'emotion') icon = '😔';
    else if (issue.type === 'interaction') icon = '💬';

    // 获取状态文本
    let statusText = '';
    let statusClass = '';
    if (issue.status === 'pending') {
        statusText = '待处理';
        statusClass = 'critical';
    } else if (issue.status === 'processing') {
        statusText = '处理中';
        statusClass = 'warning';
    } else {
        statusText = '已解决';
        statusClass = 'resolved';
    }

    div.innerHTML = `
        <input type="checkbox" class="issue-checkbox" data-id="${issue.id}">
        <div class="issue-icon ${issue.level}">${icon}</div>
        <div class="issue-content">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-meta">
                <span>📅 ${issue.date}</span>
                <span>👤 ${issue.student}</span>
                <span>🏫 ${issue.class}</span>
                <span>👨‍🏫 ${issue.teacher}</span>
            </div>
        </div>
        <span class="issue-tag ${statusClass}">${statusText}</span>
        <div class="issue-actions">
            <button class="issue-btn" onclick="viewIssueDetail('${issue.id}')">查看</button>
            <button class="issue-btn" onclick="assignIssue('${issue.id}')">分配</button>
        </div>
    `;

    // 复选框事件
    const checkbox = div.querySelector('.issue-checkbox');
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            selectedIssues.push(issue.id);
        } else {
            selectedIssues = selectedIssues.filter(id => id !== issue.id);
        }
    });

    return div;
}

// 更新时间轴
function updateTimeline(records) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    records.forEach(record => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        let dotClass = 'timeline-dot';
        if (record.status === 'resolved') dotClass += ' resolved';
        else if (record.status === 'processing') dotClass += ' processing';

        item.innerHTML = `
            <div class="${dotClass}"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-title">${record.title}</span>
                    <span class="timeline-time">${record.time}</span>
                </div>
                <div class="timeline-desc">${record.description}</div>
                <div class="timeline-footer">
                    <span>处理人：${record.handler}</span>
                    <span>${record.result}</span>
                </div>
            </div>
        `;

        timeline.appendChild(item);
    });
}

// 更新分页
function updatePagination(total) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(total / pageSize);

    pagination.innerHTML = '';

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadManageData();
        }
    });
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            loadManageData();
        });
        pagination.appendChild(pageBtn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadManageData();
        }
    });
    pagination.appendChild(nextBtn);
}

// 加载统计数据
function loadStatisticsData() {
    const mockData = Data.getMockManageData();

    // 时段分布图
    const timeChart = echarts.init(document.getElementById('timeChart'));
    timeChart.setOption({
        tooltip: {},
        xAxis: {
            type: 'category',
            data: mockData.timeData.labels
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: mockData.timeData.values,
            type: 'bar',
            itemStyle: {
                color: '#3b82f6'
            }
        }]
    });

    // 班级分布图
    const classChart = echarts.init(document.getElementById('classChart'));
    classChart.setOption({
        tooltip: {},
        xAxis: {
            type: 'category',
            data: mockData.classData.labels
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: mockData.classData.values,
            type: 'bar',
            itemStyle: {
                color: '#f59e0b'
            }
        }]
    });

    // 学生排行榜
    const studentRank = document.getElementById('studentRank');
    studentRank.innerHTML = '';

    mockData.studentRank.forEach((student, index) => {
        const item = document.createElement('div');
        item.className = 'rank-item';
        item.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <img src="${student.avatar}" alt="${student.name}" class="rank-avatar">
            <div class="rank-info">
                <div class="rank-name">${student.name}</div>
                <div class="rank-class">${student.class}</div>
            </div>
            <span class="rank-value">${student.count}次</span>
        `;
        studentRank.appendChild(item);
    });

    // 处理效率图
    const efficiencyChart = echarts.init(document.getElementById('efficiencyChart'));
    efficiencyChart.setOption({
        tooltip: {},
        series: [{
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '80%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 5,
            progress: {
                show: true,
                width: 15,
                roundCap: true,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: '#ef4444' },
                            { offset: 0.5, color: '#f59e0b' },
                            { offset: 1, color: '#10b981' }
                        ]
                    }
                }
            },
            axisLine: {
                lineStyle: {
                    width: 15
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            detail: {
                valueAnimation: true,
                fontSize: 20,
                offsetCenter: [0, 20],
                formatter: '{value}%'
            },
            data: [{
                value: mockData.efficiency,
                name: '处理效率'
            }]
        }]
    });
}

// 查看问题详情
function viewIssueDetail(issueId) {
    const modal = document.getElementById('issueModal');
    const modalBody = document.getElementById('modalBody');

    // 获取问题详情
    const mockData = Data.getMockManageData();
    const issue = mockData.issues.find(i => i.id === issueId);

    if (issue) {
        modalBody.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="margin-bottom: 10px; color: #333;">${issue.title}</h4>
                <p style="color: #666; line-height: 1.6;">${issue.description}</p>
            </div>
            <div class="detail-item">
                <span class="detail-label">学生：</span>
                <span class="detail-value">${issue.student}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">班级：</span>
                <span class="detail-value">${issue.class}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">教师：</span>
                <span class="detail-value">${issue.teacher}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">发现时间：</span>
                <span class="detail-value">${issue.date} ${issue.time}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">问题级别：</span>
                <span class="detail-value" style="color: ${issue.level === 'critical' ? '#ef4444' : issue.level === 'warning' ? '#f59e0b' : '#3b82f6'}">
                    ${issue.level === 'critical' ? '严重' : issue.level === 'warning' ? '警告' : '一般'}
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">当前状态：</span>
                <span class="detail-value">${issue.status === 'pending' ? '待处理' : issue.status === 'processing' ? '处理中' : '已解决'}</span>
            </div>
        `;

        modal.style.display = 'flex';
    }
}

// 分配问题
function assignIssue(issueId) {
    // 这里可以打开分配对话框
    alert('分配功能开发中...');
}

// 更新问题状态
function updateIssueStatus(status) {
    // 这里可以调用API更新状态
    alert(`问题已标记为${status === 'processing' ? '处理中' : '已解决'}`);
    document.getElementById('issueModal').style.display = 'none';
    loadManageData(); // 刷新列表
}

// 批量操作
document.getElementById('batchResolve').addEventListener('click', function () {
    if (selectedIssues.length === 0) {
        alert('请先选择要处理的问题');
        return;
    }
    alert(`已批量解决 ${selectedIssues.length} 个问题`);
    selectedIssues = [];
    loadManageData();
});

document.getElementById('batchAssign').addEventListener('click', function () {
    if (selectedIssues.length === 0) {
        alert('请先选择要分配的问题');
        return;
    }
    alert('批量分配功能开发中...');
});

document.getElementById('generateReport').addEventListener('click', function () {
    alert('生成报告功能开发中...');
});

document.getElementById('notifyTeachers').addEventListener('click', function () {
    alert('通知教师功能开发中...');
});

// 导出数据
function exportData() {
    alert('导出数据功能开发中...');
}

// 显示加载状态
function showLoading() {
    // 可以添加加载动画
    console.log('加载中...');
}

// 在 Data.js 中添加模拟数据
Data.getMockManageData = function () {
    return {
        stats: {
            pending: 23,
            critical: 8,
            normal: 15,
            resolved: 47
        },

        trendData: {
            dates: ['03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13'],
            issues: [12, 15, 8, 10, 14, 9, 11],
            resolved: [8, 10, 5, 7, 9, 6, 8]
        },

        typeData: [
            { name: '专注度问题', value: 45 },
            { name: '行为异常', value: 28 },
            { name: '情绪问题', value: 32 },
            { name: '互动不足', value: 18 }
        ],

        issues: [
            {
                id: '1',
                title: '学生长时间低头睡觉',
                description: '张小明在数学课上持续睡觉超过15分钟，多次提醒无效',
                student: '张小明',
                class: '初三(2)班',
                teacher: '张老师',
                date: '2026-03-13',
                time: '09:35',
                type: 'behavior',
                level: 'critical',
                status: 'pending'
            },
            {
                id: '2',
                title: '专注度持续下降',
                description: '李小红专注度评分从85%降至45%，持续20分钟',
                student: '李小红',
                class: '初三(2)班',
                teacher: '张老师',
                date: '2026-03-13',
                time: '10:15',
                type: 'attention',
                level: 'warning',
                status: 'processing'
            },
            {
                id: '3',
                title: '情绪异常波动',
                description: '王大力出现焦虑情绪，频繁看手表、坐立不安',
                student: '王大力',
                class: '高一(5)班',
                teacher: '李老师',
                date: '2026-03-13',
                time: '09:50',
                type: 'emotion',
                level: 'warning',
                status: 'pending'
            },
            {
                id: '4',
                title: '课堂互动参与度低',
                description: '赵小花整节课未参与任何互动，未举手回答问题',
                student: '赵小花',
                class: '高一(5)班',
                teacher: '李老师',
                date: '2026-03-12',
                time: '14:20',
                type: 'interaction',
                level: 'info',
                status: 'resolved'
            },
            {
                id: '5',
                title: '与同桌频繁说话',
                description: '陈小强与同桌交头接耳，影响课堂秩序',
                student: '陈小强',
                class: '初二(3)班',
                teacher: '王老师',
                date: '2026-03-12',
                time: '11:05',
                type: 'behavior',
                level: 'warning',
                status: 'processing'
            },
            {
                id: '6',
                title: '疑似身体不适',
                description: '刘小美面色潮红，精神状态不佳，建议关注',
                student: '刘小美',
                class: '初二(3)班',
                teacher: '王老师',
                date: '2026-03-11',
                time: '15:30',
                type: 'emotion',
                level: 'critical',
                status: 'resolved'
            }
        ],

        records: [
            {
                title: '处理学生睡觉问题',
                description: '与张小明谈话，了解原因，联系家长',
                time: '2026-03-13 10:30',
                handler: '张老师',
                status: 'processing',
                result: '已安排心理辅导'
            },
            {
                title: '解决专注度下降问题',
                description: '调整李小红座位，增加课堂互动',
                time: '2026-03-13 11:00',
                handler: '张老师',
                status: 'resolved',
                result: '专注度提升至75%'
            },
            {
                title: '处理情绪问题',
                description: '与王大力沟通，了解学习压力',
                time: '2026-03-13 10:15',
                handler: '李老师',
                status: 'pending',
                result: '待跟进'
            }
        ],

        timeData: {
            labels: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节'],
            values: [8, 12, 15, 10, 14, 9, 6]
        },

        classData: {
            labels: ['初三(2)班', '高一(5)班', '初二(3)班', '高三(1)班'],
            values: [28, 35, 22, 18]
        },

        studentRank: [
            { name: '陈小强', class: '初二(3)班', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', count: 12 },
            { name: '张小明', class: '初三(2)班', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', count: 8 },
            { name: '刘小美', class: '初二(3)班', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', count: 7 },
            { name: '王大力', class: '高一(5)班', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', count: 6 },
            { name: '李小红', class: '初三(2)班', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', count: 5 }
        ],

        efficiency: 78,

        totalCount: 12
    };
};