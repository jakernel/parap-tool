<template>
    <div class="wechat-container">
        <h1>微信模板消息发送</h1>
        <div class="form-container">
            <div class="input-group">
                <label for="templateId">模板ID:</label>
                <input id="templateId" v-model="templateId" type="text" placeholder="请输入模板ID" />
            </div>

            <div class="input-group">
                <label for="toUser">用户ID:</label>
                <input id="toUser" v-model="toUser" type="text" placeholder="请输入用户OpenID" />
            </div>

            <div class="input-group">
                <label for="dataInput">数据(JSON格式):</label>
                <textarea id="dataInput" v-model="dataInput"
                    placeholder='请输入JSON格式的数据，例如: {"first":{"value":"你好"},"keyword1":{"value":"值1"},"remark":{"value":"备注"}}'
                    rows="6"></textarea>
            </div>

            <button @click="sendTemplateMessage" :disabled="loading" class="send-btn">
                {{ loading ? '发送中...' : '发送模板消息' }}
            </button>

            <div v-if="result" class="result-container">
                <h3>发送结果:</h3>
                <pre>{{ JSON.stringify(result, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { tokenfetch } from '@/utils/dev'
import { getHostName } from '../utils/dev';

export default {
    name: 'WeChatView',
    setup() {
        const templateId = ref('Fz6z3v6K8dJLCngAsnLJj7R9w0OCFbSiTOwmlAUzmiU')
        const toUser = ref('ofpl32EeSHy5QHFeWFVZaXfhYcY8')
        const dataInput = ref('{"app":"app","info":"内容","time":"2023-04-01 12:00:00"}')
        const loading = ref(false)
        const result = ref(null)

        const sendTemplateMessage = async () => {
            if (!templateId.value) {
                alert('请输入模板ID')
                return
            }
            if (!toUser.value) {
                alert('请输入用户ID')
                return
            }
            if (!dataInput.value) {
                alert('请输入数据')
                return
            }

            let dataObj
            try {
                dataObj = JSON.parse(dataInput.value)
            } catch (e) {
                alert('数据格式错误，请输入有效的JSON格式')
                return
            }

            loading.value = true
            result.value = null

            try {
                const hostName = await getHostName('gzh')
                const response = await tokenfetch(hostName + '/wechat/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        TemplateID: templateId.value,
                        ToUser: toUser.value,
                        Data: dataObj
                    })
                })

                if (response.ok) {
                    result.value = '发送成功！' + await response.text()
                } else {
                    const errorData = await response.text()
                    result.value = `发送失败: ${errorData.message || '未知错误'}`
                }
            } catch (error) {
                console.error('发送失败:', error)
                alert(`发送失败: ${error.message}`)
            } finally {
                loading.value = false
            }
        }

        return {
            templateId,
            toUser,
            dataInput,
            loading,
            result,
            sendTemplateMessage
        }
    }
}
</script>

<style scoped>
.wechat-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.form-container {
    margin-top: 20px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.input-group input,
.input-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.send-btn {
    background-color: #42b983;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.send-btn:hover:not(:disabled) {
    background-color: #359c6d;
}

.send-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.result-container {
    margin-top: 20px;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow-x: auto;
}

.result-container h3 {
    margin-top: 0;
}
</style>