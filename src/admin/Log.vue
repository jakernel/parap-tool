<template>
    <div class="log-container">
        <div class="log-form">
            <h2>日志查询工具</h2>

            <div class="select-section">
                <label for="log-key-select">选择日志类型:</label>
                <select id="log-key-select" v-model="selectedKey" class="select-field">
                    <option value="qd">qd</option>
                    <option value="189">189</option>
                </select>
            </div>

            <div class="fetch-section">
                <Btn :loading="loading" @click="fetchLogs" class="fetch-button">
                    获取日志
                </Btn>
            </div>
        </div>

        <!-- 日志显示区域 -->
        <div v-if="logs.length > 0" class="log-display">
            <h3>日志信息 (共 {{ logs.length }} 条)</h3>
            <div class="log-list">
                <div v-for="(log, index) in logs" :key="index" class="log-item">
                    {{ log }}
                </div>
            </div>
        </div>

        <Alert ref="alertRef" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Btn from "@/components/Btn.vue";
import { getHostName, tokenfetch } from '@/utils/dev'
import Alert from '@/components/Alert.vue'

const loading = ref(false)
const logs = ref([])
const selectedKey = ref('qd') // 默认值为 qd
const alertRef = ref()

// 获取日志
const fetchLogs = async () => {
    loading.value = true;
    logs.value = []

    try {
        // 使用后端服务代理API请求
        const hostName = await getHostName("parap")
        const response = await fetch(`${hostName}/logstore/get?key=${selectedKey.value}&start=0&count=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
            logs.value = data.logs;
            alertRef.value.show(`成功获取 ${data.logs.length} 条日志`);
        }
    } catch (error) {
        console.error('获取日志时出错:', error);
        alertRef.value.show('获取日志时出错: ' + error.message);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.log-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60vh;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.log-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 600px;
    margin-bottom: 30px;
    text-align: center;
}

.select-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.select-field {
    width: 100%;
    max-width: 400px;
    padding: 10px;
    border: 1px solid var(--c-border);
    border-radius: 4px;
    font-size: 16px;
    background-color: var(--c-bg);
    color: var(--c-text);
}

.fetch-section {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.fetch-button {
    padding: 12px 20px;
    font-size: 16px;
    min-width: 150px;
}

.log-display {
    width: 100%;
    max-width: 1000px;
    margin-top: 20px;
}

.log-display h3 {
    color: var(--c-green);
    margin-bottom: 15px;
    text-align: center;
}

.log-list {
    background-color: var(--c-bg);
    border: 1px solid var(--c-border);
    border-radius: 8px;
    padding: 15px;
    max-height: 500px;
    overflow-y: auto;
}

.log-item {
    padding: 8px 0;
    border-bottom: 1px solid var(--c-border-light);
    word-break: break-all;
    font-family: monospace;
    font-size: 14px;
}

.log-item:last-child {
    border-bottom: none;
}
</style>