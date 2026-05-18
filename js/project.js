// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('反馈工程页面加载完成');

    // 初始化标签页
    initTabs();

    // 初始化模板分类
    initTemplateCategories();

    // 初始化模态框
    initModal();

    // 加载数据
    loadProjectData();

    // 初始化设置项
    initSettings();

    // 绑定事件
    bindEvents();
});

// 当前选中的标签页
let currentTab = 'templates';
let currentTemplatePage = 1;
let currentHistoryPage = 1;
const pageSize = 10;

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
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(tabId + 'Tab').classList.add('active');

            currentTab = tabId;

            // 根据标签页加载数据
            if (tabId === 'history') {
                loadHistoryData();
            } else if (tabId === 'analysis') {
                loadAnalysisData();
            }
        });
    });
}

// 初始化模板分类
function initTemplateCategories() {
    const categories = document.querySelectorAll('.category-btn');

    categories.forEach(category => {
        category.addEventListener('click', function () {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // 过滤模板
            const categoryType = this.dataset.category;
            filterTemplates(categoryType);
        });
    });
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('templateModal');
    const createBtn = document.getElementById('createTemplateBtn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelTemplate');

    // 打开模态框
    createBtn.addEventListener('click', function () {
        modal.style.display = 'flex';
        document.getElementById('templateForm').reset();
    });

    // 关闭模态框
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 保存模板
    document.getElementById('saveTemplate').addEventListener('click', function () {
        saveTemplate();
    });

    // 变量标签点击
    document.querySelectorAll('.variable-tag').forEach(tag => {
        tag.addEventListener('click', function () {
            const textarea = document.getElementById('templateContent');
            const variable = this.textContent;
            textarea.value += ' ' + variable;
        });
    });
}

// 初始化设置
function initSettings() {
    // 加载保存的设置
    const settings = JSON.parse(localStorage.getItem('feedbackSettings')) || {};

    document.getElementById('autoFeedback').checked = settings.autoFeedback !== false;
    document.getElementById('behaviorAlert').checked = settings.behaviorAlert !== false;
    document.getElementById('attentionAlert').checked = settings.attentionAlert !== false;
    document.getElementById('dailyReport').checked = settings.dailyReport || false;
    document.getElementById('defaultType').value = settings.defaultType || 'teaching';
    document.getElementById('defaultStyle').value = settings.defaultStyle || 'formal';
    document.getElementById('emailNotify').checked = settings.emailNotify !== false;
    document.getElementById('notifyEmail').value = settings.notifyEmail || '';
    document.getElementById('smsNotify').checked = settings.smsNotify || false;
    document.getElementById('notifyPhone').value = settings.notifyPhone || '';
    document.getElementById('wechatNotify').checked = settings.wechatNotify !== false;
    document.getElementById('notifyWechat').value = settings.notifyWechat || '';
    document.getElementById('exportFormat').value = settings.exportFormat || 'excel';
    document.getElementById('exportRange').value = settings.exportRange || 'week';
    document.getElementById('autoExport').checked = settings.autoExport || false;
    document.getElementById('autoExportTime').value = settings.autoExportTime || 'weekly';
    document.getElementById('teacherEdit').checked = settings.teacherEdit !== false;
    document.getElementById('teacherCreate').checked = settings.teacherCreate !== false;
    document.getElementById('adminOnly').checked = settings.adminOnly || false;
    document.getElementById('shareTemplates').checked = settings.shareTemplates !== false;
}

// 绑定事件
function bindEvents() {
    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', function () {
        saveSettings();
    });

    // 恢复默认设置
    document.getElementById('resetSettings').addEventListener('click', function () {
        resetSettings();
    });

    // 搜索历史
    document.getElementById('searchHistoryBtn').addEventListener('click', function () {
        currentHistoryPage = 1;
        loadHistoryData();
    });

    // 刷新分析数据
    document.getElementById('refreshAnalysis').addEventListener('click', function () {
        loadAnalysisData();
    });
}

// 加载项目数据
function loadProjectData() {
    const mockData = Data.getMockProjectData();

    // 更新统计卡片
    document.getElementById('templateCount').textContent = mockData.stats.templateCount;
    document.getElementById('todayFeedback').textContent = mockData.stats.todayFeedback;
    document.getElementById('weekFeedback').textContent = mockData.stats.weekFeedback;
    document.getElementById('teacherCount').textContent = mockData.stats.teacherCount;

    // 加载模板
    loadTemplates(mockData.templates);
}

// 加载模板
function loadTemplates(templates) {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '';

    templates.forEach(template => {
        const card = createTemplateCard(template);
        grid.appendChild(card);
    });
}

// 创建模板卡片
function createTemplateCard(template) {
    const div = document.createElement('div');
    div.className = `template-card ${template.favorite ? 'favorite' : ''}`;

    // 获取类型样式
    let typeClass = 'template-badge ';
    if (template.type === 'teaching') typeClass += 'teaching';
    else if (template.type === 'behavior') typeClass += 'behavior';
    else if (template.type === 'academic') typeClass += 'academic';
    else typeClass += 'communication';

    // 获取类型文本
    let typeText = '';
    if (template.type === 'teaching') typeText = '教学反馈';
    else if (template.type === 'behavior') typeText = '行为反馈';
    else if (template.type === 'academic') typeText = '学业反馈';
    else typeText = '沟通反馈';

    div.innerHTML = `
        ${template.favorite ? '<span class="template-favorite">⭐</span>' : ''}
        <div class="template-header">
            <span class="template-title">${template.name}</span>
            <span class="${typeClass}">${typeText}</span>
        </div>
        <div class="template-preview">${template.content.substring(0, 50)}...</div>
        <div class="template-meta">
            <span>📅 ${template.usage}次使用</span>
            <span>👤 ${template.creator}</span>
        </div>
        <div class="template-actions">
            <button class="template-btn edit" onclick="editTemplate('${template.id}')">编辑</button>
            <button class="template-btn use" onclick="useTemplate('${template.id}')">使用</button>
            <button class="template-btn delete" onclick="deleteTemplate('${template.id}')">删除</button>
        </div>
    `;

    return div;
}

// 过滤模板
function filterTemplates(category) {
    const mockData = Data.getMockProjectData();
    let filteredTemplates = mockData.templates;

    if (category !== 'all') {
        filteredTemplates = filteredTemplates.filter(t => t.type === category);
    }

    loadTemplates(filteredTemplates);
}

// 加载历史数据
function loadHistoryData() {
    const mockData = Data.getMockProjectData();
    const list = document.getElementById('historyList');

    // 获取筛选条件
    const search = document.getElementById('historySearch').value.toLowerCase();
    const type = document.getElementById('historyType').value;
    const date = document.getElementById('historyDate').value;

    // 过滤历史记录
    let filteredHistory = mockData.history;

    if (search) {
        filteredHistory = filteredHistory.filter(h =>
            h.title.toLowerCase().includes(search) ||
            h.teacher.toLowerCase().includes(search) ||
            h.student.toLowerCase().includes(search)
        );
    }

    if (type !== 'all') {
        filteredHistory = filteredHistory.filter(h => h.type === type);
    }

    if (date) {
        filteredHistory = filteredHistory.filter(h => h.date === date);
    }

    // 分页
    const start = (currentHistoryPage - 1) * pageSize;
    const paginatedHistory = filteredHistory.slice(start, start + pageSize);

    list.innerHTML = '';

    paginatedHistory.forEach(item => {
        const historyItem = createHistoryItem(item);
        list.appendChild(historyItem);
    });

    // 更新分页
    updateHistoryPagination(filteredHistory.length);
}

// 创建历史记录项
function createHistoryItem(item) {
    const div = document.createElement('div');
    div.className = 'history-item';

    // 获取图标样式
    let iconClass = 'history-icon ';
    if (item.type === 'teaching') iconClass += 'teaching';
    else if (item.type === 'behavior') iconClass += 'behavior';
    else if (item.type === 'academic') iconClass += 'academic';
    else iconClass += 'communication';

    // 获取图标
    let icon = '📝';
    if (item.type === 'teaching') icon = '📚';
    else if (item.type === 'behavior') icon = '👋';
    else if (item.type === 'academic') icon = '📊';
    else icon = '💬';

    div.innerHTML = `
        <div class="${iconClass}">${icon}</div>
        <div class="history-content">
            <div class="history-title">${item.title}</div>
            <div class="history-meta">
                <span>👤 ${item.teacher} → ${item.student}</span>
                <span>📅 ${item.date}</span>
                <span>🏫 ${item.class}</span>
            </div>
        </div>
        <span class="history-status ${item.status}">${item.status === 'read' ? '已读' : '未读'}</span>
    `;

    return div;
}

// 更新历史分页
function updateHistoryPagination(total) {
    const pagination = document.getElementById('historyPagination');
    const totalPages = Math.ceil(total / pageSize);

    pagination.innerHTML = '';

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentHistoryPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentHistoryPage > 1) {
            currentHistoryPage--;
            loadHistoryData();
        }
    });
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentHistoryPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentHistoryPage = i;
            loadHistoryData();
        });
        pagination.appendChild(pageBtn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '›';
    nextBtn.disabled = currentHistoryPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentHistoryPage < totalPages) {
            currentHistoryPage++;
            loadHistoryData();
        }
    });
    pagination.appendChild(nextBtn);
}

// 加载分析数据
function loadAnalysisData() {
    const mockData = Data.getMockProjectData();
    const range = document.getElementById('analysisRange').value;

    // 趋势图
    const trendChart = echarts.init(document.getElementById('trendChart'));
    trendChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: mockData.analysis.trend.dates
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: mockData.analysis.trend.values,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#3b82f6',
                width: 2
            },
            areaStyle: {
                color: 'rgba(59, 130, 246, 0.1)'
            }
        }]
    });

    // 类型分布图
    const typeChart = echarts.init(document.getElementById('typeChart'));
    typeChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            data: mockData.analysis.typeDistribution,
            label: {
                show: true,
                formatter: '{b}: {d}%'
            }
        }]
    });

    // 教师排行
    const teacherRank = document.getElementById('teacherRank');
    teacherRank.innerHTML = '';
    mockData.analysis.teacherRank.forEach((teacher, index) => {
        const item = document.createElement('div');
        item.className = 'rank-item';
        item.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <img src="${teacher.avatar}" alt="${teacher.name}" class="rank-avatar">
            <div class="rank-info">
                <div class="rank-name">${teacher.name}</div>
                <div class="rank-detail">反馈 ${teacher.count} 条</div>
            </div>
            <span class="rank-value">${teacher.count}</span>
        `;
        teacherRank.appendChild(item);
    });

    // 班级排行
    const classRank = document.getElementById('classRank');
    classRank.innerHTML = '';
    mockData.analysis.classRank.forEach((cls, index) => {
        const item = document.createElement('div');
        item.className = 'rank-item';
        item.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <div class="rank-info">
                <div class="rank-name">${cls.name}</div>
                <div class="rank-detail">反馈 ${cls.count} 条</div>
            </div>
            <span class="rank-value">${cls.count}</span>
        `;
        classRank.appendChild(item);
    });

    // 响应时间图
    const responseChart = echarts.init(document.getElementById('responseChart'));
    responseChart.setOption({
        tooltip: {},
        xAxis: {
            type: 'category',
            data: mockData.analysis.responseTime.labels
        },
        yAxis: {
            type: 'value',
            name: '小时'
        },
        series: [{
            data: mockData.analysis.responseTime.values,
            type: 'bar',
            itemStyle: {
                color: '#10b981'
            }
        }]
    });

    // 满意度图
    const satisfactionChart = echarts.init(document.getElementById('satisfactionChart'));
    satisfactionChart.setOption({
        tooltip: {},
        series: [{
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '80%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            progress: {
                show: true,
                width: 15,
                roundCap: true,
                itemStyle: {
                    color: '#f59e0b'
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
                value: mockData.analysis.satisfaction,
                name: '满意度'
            }]
        }]
    });
}

// 保存模板
function saveTemplate() {
    const name = document.getElementById('templateName').value;
    const type = document.getElementById('templateType').value;
    const content = document.getElementById('templateContent').value;
    const setAsDefault = document.getElementById('setAsDefault').checked;

    if (!name || !content) {
        alert('请填写模板名称和内容');
        return;
    }

    // 这里可以调用API保存模板
    console.log('保存模板:', { name, type, content, setAsDefault });

    alert('模板保存成功！');
    document.getElementById('templateModal').style.display = 'none';

    // 刷新模板列表
    loadProjectData();
}

// 编辑模板
function editTemplate(id) {
    alert('编辑模板功能开发中，ID: ' + id);
}

// 使用模板
function useTemplate(id) {
    alert('使用模板功能开发中，ID: ' + id);
}

// 删除模板
function deleteTemplate(id) {
    if (confirm('确定要删除这个模板吗？')) {
        alert('模板已删除，ID: ' + id);
        // 刷新模板列表
        loadProjectData();
    }
}

// 保存设置
function saveSettings() {
    const settings = {
        autoFeedback: document.getElementById('autoFeedback').checked,
        behaviorAlert: document.getElementById('behaviorAlert').checked,
        attentionAlert: document.getElementById('attentionAlert').checked,
        dailyReport: document.getElementById('dailyReport').checked,
        defaultType: document.getElementById('defaultType').value,
        defaultStyle: document.getElementById('defaultStyle').value,
        emailNotify: document.getElementById('emailNotify').checked,
        notifyEmail: document.getElementById('notifyEmail').value,
        smsNotify: document.getElementById('smsNotify').checked,
        notifyPhone: document.getElementById('notifyPhone').value,
        wechatNotify: document.getElementById('wechatNotify').checked,
        notifyWechat: document.getElementById('notifyWechat').value,
        exportFormat: document.getElementById('exportFormat').value,
        exportRange: document.getElementById('exportRange').value,
        autoExport: document.getElementById('autoExport').checked,
        autoExportTime: document.getElementById('autoExportTime').value,
        teacherEdit: document.getElementById('teacherEdit').checked,
        teacherCreate: document.getElementById('teacherCreate').checked,
        adminOnly: document.getElementById('adminOnly').checked,
        shareTemplates: document.getElementById('shareTemplates').checked
    };

    localStorage.setItem('feedbackSettings', JSON.stringify(settings));
    alert('设置保存成功！');
}

// 恢复默认设置
function resetSettings() {
    if (confirm('确定要恢复默认设置吗？')) {
        localStorage.removeItem('feedbackSettings');
        initSettings();
        alert('已恢复默认设置');
    }
}

// 在 Data.js 中添加模拟数据
Data.getMockProjectData = function () {
    return {
        stats: {
            templateCount: 24,
            todayFeedback: 156,
            weekFeedback: 892,
            teacherCount: 18
        },

        templates: [
            {
                id: '1',
                name: '课堂专注度反馈',
                type: 'teaching',
                content: '{{学生姓名}}同学，本节课你的专注度评分为{{专注度}}分，互动次数为{{互动次数}}次。建议：{{建议}}',
                usage: 156,
                creator: '张老师',
                favorite: true
            },
            {
                id: '2',
                name: '课堂行为反馈',
                type: 'behavior',
                content: '{{学生姓名}}同学，本节课你出现了{{行为}}行为。希望你能注意课堂纪律。',
                usage: 98,
                creator: '李老师',
                favorite: false
            },
            {
                id: '3',
                name: '学业进步反馈',
                type: 'academic',
                content: '{{学生姓名}}同学，祝贺你在{{科目}}考试中取得进步！从{{上次成绩}}分提升到{{本次成绩}}分。',
                usage: 76,
                creator: '王老师',
                favorite: true
            },
            {
                id: '4',
                name: '家长沟通模板',
                type: 'communication',
                content: '{{家长姓名}}您好，关于{{学生姓名}}近期{{情况}}，想与您沟通一下。',
                usage: 45,
                creator: '赵老师',
                favorite: false
            },
            {
                id: '5',
                name: '课堂互动反馈',
                type: 'teaching',
                content: '{{学生姓名}}同学，本节课你积极参与互动，回答{{回答次数}}次，提出{{提问次数}}个问题。',
                usage: 112,
                creator: '张老师',
                favorite: true
            },
            {
                id: '6',
                name: '作业完成反馈',
                type: 'academic',
                content: '{{学生姓名}}同学，本次{{作业名称}}你完成得{{评价}}，正确率{{正确率}}%。',
                usage: 89,
                creator: '李老师',
                favorite: false
            }
        ],

        history: [
            {
                id: '1',
                title: '课堂专注度反馈 - 张小明',
                type: 'teaching',
                teacher: '张老师',
                student: '张小明',
                class: '初三(2)班',
                date: '2026-03-13',
                status: 'read'
            },
            {
                id: '2',
                title: '课堂行为反馈 - 李小红',
                type: 'behavior',
                teacher: '李老师',
                student: '李小红',
                class: '初三(2)班',
                date: '2026-03-13',
                status: 'unread'
            },
            {
                id: '3',
                title: '学业进步反馈 - 王大力',
                type: 'academic',
                teacher: '王老师',
                student: '王大力',
                class: '高一(5)班',
                date: '2026-03-12',
                status: 'read'
            },
            {
                id: '4',
                title: '家长沟通 - 赵小花家长',
                type: 'communication',
                teacher: '赵老师',
                student: '赵小花',
                class: '高一(5)班',
                date: '2026-03-12',
                status: 'read'
            },
            {
                id: '5',
                title: '课堂互动反馈 - 陈小强',
                type: 'teaching',
                teacher: '张老师',
                student: '陈小强',
                class: '初二(3)班',
                date: '2026-03-11',
                status: 'unread'
            }
        ],

        analysis: {
            trend: {
                dates: ['03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13'],
                values: [120, 135, 142, 128, 156, 148, 165]
            },
            typeDistribution: [
                { name: '教学反馈', value: 45 },
                { name: '行为反馈', value: 28 },
                { name: '学业反馈', value: 32 },
                { name: '沟通反馈', value: 18 }
            ],
            teacherRank: [
                { name: '张老师', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', count: 156 },
                { name: '李老师', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', count: 142 },
                { name: '王老师', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', count: 128 },
                { name: '赵老师', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', count: 98 },
                { name: '刘老师', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', count: 76 }
            ],
            classRank: [
                { name: '初三(2)班', count: 245 },
                { name: '高一(5)班', count: 212 },
                { name: '初二(3)班', count: 188 },
                { name: '高三(1)班', count: 156 }
            ],
            responseTime: {
                labels: ['教学', '行为', '学业', '沟通'],
                values: [2.5, 1.8, 3.2, 4.5]
            },
            satisfaction: 86
        }
    };
};