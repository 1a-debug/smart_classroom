// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化侧边栏菜单
    initMenu();

    // 加载头像数据
    loadFaceData();

    // 加载专注度数据
    loadFocusData();

    // 初始化图表
    initCharts();

    // 从API获取数据
    fetchDashboardData();
});

// 初始化菜单
function initMenu() {
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 移除所有active类
            menuItems.forEach(i => i.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');

            // 根据点击项跳转页面
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

// 页面导航
function navigateTo(page) {
    switch (page) {
        case 'dashboard':
            window.location.href = 'index.html';
            break;
        case 'feedback':
            window.location.href = 'feedback.html';
            break;
        case 'action':
            window.location.href = 'action.html';
            break;
        case 'teaching':
            window.location.href = 'teaching.html';
            break;
        case 'manage':
            window.location.href = 'manage.html';
            break;
        case 'project':
            window.location.href = 'project.html';
            break;
        default:
            console.log('页面开发中:', page);
    }
}

// 加载头像数据
function loadFaceData() {
    const faceBox = document.getElementById('faceBox');
    if (!faceBox) return;

    // 从API获取数据
    API.getFaceData().then(faces => {
        faceBox.innerHTML = '';
        faces.forEach(face => {
            const faceDiv = document.createElement('div');
            faceDiv.className = 'face';
            faceDiv.innerHTML = `
                <img src="${face.avatar}" alt="${face.name}">
                <p>${face.name}</p>
            `;
            faceBox.appendChild(faceDiv);
        });
    }).catch(() => {
        // 使用模拟数据
        const mockFaces = Data.getMockFaces();
        faceBox.innerHTML = '';
        mockFaces.forEach(face => {
            const faceDiv = document.createElement('div');
            faceDiv.className = 'face';
            faceDiv.innerHTML = `
                <img src="${face.avatar}" alt="${face.name}">
                <p>${face.name}</p>
            `;
            faceBox.appendChild(faceDiv);
        });
    });
}

// 加载专注度数据
function loadFocusData() {
    const focusCircle = document.getElementById('focusCircle');
    const focusBars = document.getElementById('focusBars');
    if (!focusCircle || !focusBars) return;

    // 从API获取数据
    API.getFocusData().then(data => {
        // 更新圆形
        focusCircle.textContent = data.overall + '%';
        focusCircle.style.background = `conic-gradient(#3b82f6 ${data.overall}%, #eaeaea 0)`;

        // 更新进度条
        focusBars.innerHTML = '';
        data.details.forEach(item => {
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.innerHTML = `
                <span class="bar-label">${item.label}</span>
                <div class="bar-bg">
                    <div class="bar-fill" style="width:${item.value}%"></div>
                </div>
                <span class="bar-value">${item.value}%</span>
            `;
            focusBars.appendChild(barDiv);
        });
    }).catch(() => {
        // 使用模拟数据
        const mockData = Data.getMockFocusData();
        focusCircle.textContent = mockData.overall + '%';
        focusCircle.style.background = `conic-gradient(#3b82f6 ${mockData.overall}%, #eaeaea 0)`;

        focusBars.innerHTML = '';
        mockData.details.forEach(item => {
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.innerHTML = `
                <span class="bar-label">${item.label}</span>
                <div class="bar-bg">
                    <div class="bar-fill" style="width:${item.value}%"></div>
                </div>
                <span class="bar-value">${item.value}%</span>
            `;
            focusBars.appendChild(barDiv);
        });
    });
}

// 初始化图表
function initCharts() {
    // 折线图
    const lineChartElem = document.getElementById('lineChart');
    if (lineChartElem) {
        initLineChart(lineChartElem);
    }

    // 柱状图
    const barChartElem = document.getElementById('barChart');
    if (barChartElem) {
        initBarChart(barChartElem);
    }
}

// 折线图
function initLineChart(element) {
    const chart = echarts.init(element);

    API.getLineChartData().then(data => {
        chart.setOption({
            tooltip: {},
            xAxis: {
                type: 'category',
                data: data.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.values,
                type: 'line',
                smooth: true,
                areaStyle: {},
                lineStyle: { color: '#1c4fb3' }
            }]
        });
    }).catch(() => {
        // 使用模拟数据
        const mockData = Data.getMockLineData();
        chart.setOption({
            tooltip: {},
            xAxis: {
                type: 'category',
                data: mockData.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: mockData.values,
                type: 'line',
                smooth: true,
                areaStyle: {},
                lineStyle: { color: '#1c4fb3' }
            }]
        });
    });
}

// 柱状图
function initBarChart(element) {
    const chart = echarts.init(element);

    API.getBarChartData().then(data => {
        chart.setOption({
            tooltip: {},
            xAxis: {
                type: 'category',
                data: data.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.values,
                type: 'bar',
                itemStyle: { color: '#3b82f6' }
            }]
        });
    }).catch(() => {
        // 使用模拟数据
        const mockData = Data.getMockBarData();
        chart.setOption({
            tooltip: {},
            xAxis: {
                type: 'category',
                data: mockData.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: mockData.values,
                type: 'bar',
                itemStyle: { color: '#3b82f6' }
            }]
        });
    });
}

// 从API获取仪表盘数据
function fetchDashboardData() {
    API.getDashboardStats().then(data => {
        console.log('仪表盘数据:', data);
        // 可以在这里更新其他UI元素
    }).catch(error => {
        console.log('使用模拟数据');
    });
}
