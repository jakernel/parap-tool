<template>
    <div class="log-container">
        <div class="log-split-container">
            <!-- 左侧：日志添加工具 -->
            <div class="log-add-section">
                <h2>日志添加工具</h2>

                <div class="form-group">
                    <label for="log-key-input">日志类型:</label>
                    <input id="log-key-input" v-model="addKey" placeholder="输入日志类型" class="input-field" />
                </div>

                <div class="form-group">
                    <label for="log-value-input">日志内容:</label>
                    <textarea id="log-value-input" v-model="addValue" placeholder="输入日志内容" class="textarea-field"
                        rows="4"></textarea>
                </div>

                <div class="submit-section">
                    <Btn :loading="addLoading" @click="addLog" class="submit-button">
                        添加日志
                    </Btn>
                </div>
            </div>

            <!-- 右侧：日志查询工具 -->
            <div class="log-query-section">
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

                <!-- 日志显示区域 -->
                <div v-if="logs.length > 0" class="log-display">
                    <h3>日志信息 (共 {{ logs.length }} 条)</h3>
                    <div class="log-list">
                        <div v-for="(log, index) in logs" :key="index" class="log-item">
                            {{ log }}
                        </div>
                    </div>
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

// 查询日志相关变量
const loading = ref(false)
const logs = ref([])
const selectedKey = ref('qd') // 默认值为 qd

// 添加日志相关变量
const addLoading = ref(false)
const addKey = ref('')
const addValue = ref('')

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

// 添加日志
const addLog = async () => {
    if (!addKey.value.trim()) {
        alertRef.value.show('请输入日志类型');
        return;
    }

    if (!addValue.value.trim()) {
        alertRef.value.show('请输入日志内容');
        return;
    }

    addLoading.value = true;

    try {
        // 使用后端服务代理API请求
        const hostName = await getHostName("parap");
        const response = await tokenfetch(`${hostName}/logstore/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: addKey.value,
                value: addValue.value
            })
        });

        if (!response.ok) {
            throw new Error(`添加日志失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
            alertRef.value.show(`成功添加日志，当前总数: ${data.count}`);
            // 清空输入框 
            addKey.value = '';
            addValue.value = '';
        }
    } catch (error) {
        console.error('添加日志时出错:', error);
        alertRef.value.show('添加日志时出错: ' + error.message);
    } finally {
        addLoading.value = false;
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

.log-split-container {
    display: flex;
    gap: 30px;
    width: 100%;
    justify-content: space-between;
}

.log-add-section,
.log-query-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 550px;
    padding: 20px;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    background-color: var(--c-bg-soft);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.input-field,
.textarea-field {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--c-border);
    border-radius: 4px;
    font-size: 16px;
    background-color: var(--c-bg);
    color: var(--c-text);
}

.textarea-field {
    resize: vertical;
    min-height: 100px;
}

.submit-section {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.submit-button {
    padding: 12px 20px;
    font-size: 16px;
    min-width: 150px;
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