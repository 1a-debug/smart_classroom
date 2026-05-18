// 模拟数据
const Data = {
    // 模拟头像数据
    getMockFaces: function () {
        return [
            { name: '脸部', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
            { name: '动作', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
            { name: '面部', avatar: 'https://randomuser.me/api/portraits/women/23.jpg' },
            { name: '面部', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
            { name: '表情', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }
        ];
    },

    // 模拟专注度数据
    getMockFocusData: function () {
        return {
            overall: 85,
            details: [
                { label: '第1节', value: 85 },
                { label: '第2节', value: 70 },
                { label: '第3节', value: 60 },
                { label: '第4节', value: 75 }
            ]
        };
    },

    // 模拟折线图数据
    getMockLineData: function () {
        return {
            xAxis: ['20', '30', '40', '50', '60'],
            values: [120, 90, 150, 80, 170]
        };
    },

    // 模拟柱状图数据
    getMockBarData: function () {
        return {
            xAxis: ['1', '2', '3', '4', '5', '6', '7'],
            values: [80, 100, 140, 160, 120, 110, 90]
        };
    },

    // 模拟仪表盘统计数据
    getMockDashboardStats: function () {
        return {
            totalStudents: 45,
            averageAttention: 85,
            positiveEmotion: 78,
            interactions: 156
        };
    }
};