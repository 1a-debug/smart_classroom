// API基础配置
const API_BASE = 'http://localhost:5000/api'; // 后端地址

const API = {
    // 获取头像数据
    getFaceData: async function () {
        try {
            const response = await fetch(`${API_BASE}/faces`);
            return await response.json();
        } catch (error) {
            console.warn('API请求失败，使用模拟数据');
            throw error;
        }
    },

    // 获取专注度数据
    getFocusData: async function () {
        try {
            const response = await fetch(`${API_BASE}/focus`);
            return await response.json();
        } catch (error) {
            console.warn('API请求失败，使用模拟数据');
            throw error;
        }
    },

    // 获取折线图数据
    getLineChartData: async function () {
        try {
            const response = await fetch(`${API_BASE}/chart/line`);
            return await response.json();
        } catch (error) {
            console.warn('API请求失败，使用模拟数据');
            throw error;
        }
    },

    // 获取柱状图数据
    getBarChartData: async function () {
        try {
            const response = await fetch(`${API_BASE}/chart/bar`);
            return await response.json();
        } catch (error) {
            console.warn('API请求失败，使用模拟数据');
            throw error;
        }
    },

    // 获取仪表盘统计数据
    getDashboardStats: async function () {
        try {
            const response = await fetch(`${API_BASE}/dashboard/stats`);
            return await response.json();
        } catch (error) {
            console.warn('API请求失败，使用模拟数据');
            throw error;
        }
    },

    // 上传视频进行分析
    uploadVideo: async function (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);

        try {
            const response = await fetch(`${API_BASE}/video/upload`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('视频上传失败:', error);
            throw error;
        }
    },

    // 获取视频分析结果
    getVideoResult: async function (videoId) {
        try {
            const response = await fetch(`${API_BASE}/video/result/${videoId}`);
            return await response.json();
        } catch (error) {
            console.error('获取分析结果失败:', error);
            throw error;
        }
    },
    // ========== 新增：获取教学反馈数据 ==========
    getFeedbackData: async function (date, classId) {
        try {
            // 构建请求参数
            const params = new URLSearchParams();
            if (date) params.append('date', date);
            if (classId) params.append('classId', classId);

            const response = await fetch(`${API_BASE}/feedback/data?${params.toString()}`);
            return await response.json();
        } catch (error) {
            console.warn('获取反馈数据失败，使用模拟数据', error);
            // 抛出错误，让 feedback.js 中的 catch 处理使用模拟数据
            throw error;
        }
    }
};