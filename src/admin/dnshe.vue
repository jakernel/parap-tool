<template>
  <div class="dnshe-container">
    <div class="dnshe-form">
      <h2>DNSHE 工具</h2>

      <div class="fetch-section">
        <Btn :loading="listLoading" @click="fetchSubdomains" class="fetch-button">
          获取子域名
        </Btn>
        <p class="description">点击获取所有子域名，然后从下拉框中选择一个进行DNS查询</p>
      </div>

      <div class="select-section" v-if="subdomains.length > 0">
        <label for="subdomain-select">选择子域名:</label>
        <select id="subdomain-select" v-model="selectedSubdomainId" class="select-field">
          <option value="">请选择一个子域名</option>
          <option v-for="subdomain in subdomains" :key="subdomain.id" :value="subdomain.id">
            {{ subdomain.full_domain }} ({{ subdomain.subdomain }})
          </option>
        </select>
      </div>

      <div class="query-section" v-if="selectedSubdomainId">
        <Btn :loading="dnsLoading" @click="queryDnsRecords" class="query-button">
          查询DNS记录
        </Btn>
      </div>
    </div>

    <!-- DNS记录表格 -->
    <div v-if="dnsRecords.length > 0" class="dns-table-container">
      <h3>DNS记录 (共 {{ dnsRecords.length }} 条)</h3>
      <table class="dns-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>类型</th>
            <th>内容</th>
            <th>TTL</th>
            <th>优先级</th>
            <th>状态</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in dnsRecords" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.type }}</td>
            <td>{{ record.content }}</td>
            <td>{{ record.ttl }}</td>
            <td>{{ record.priority || '-' }}</td>
            <td>
              <span :class="['status', 'status-' + record.status]">
                {{ record.status }}
              </span>
            </td>
            <td>{{ record.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Alert ref="alertRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Btn from "@/components/Btn.vue";
import { getHostName, tokenfetch } from '@/utils/dev'
import Alert from '@/components/Alert.vue'

// 预设的API密钥
const listLoading = ref(false)
const dnsLoading = ref(false)
const subdomains = ref([])
const dnsRecords = ref([])
const selectedSubdomainId = ref('')
const alertRef = ref()

// 获取子域名列表
const fetchSubdomains = async () => {
  listLoading.value = true;
  subdomains.value = []

  try {
    // 使用后端服务代理API请求
    const hostName = await getHostName("parap")
    const response = await tokenfetch(`${hostName}/auth/dnshe/subdomains`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      subdomains.value = data.subdomains;
      alertRef.value.show(`成功获取 ${data.count} 个子域名`);
    } else {
      alertRef.value.show('获取子域名失败: ' + (data.message || '未知错误'));
    }
  } catch (error) {
    console.error('获取子域名时出错:', error);
    alertRef.value.show('获取子域名时出错: ' + error.message);
  } finally {
    listLoading.value = false;
  }
}

// 查询DNS记录
const queryDnsRecords = async () => {
  if (!selectedSubdomainId.value) {
    alertRef.value.show('请先选择一个子域名')
    return
  }

  dnsLoading.value = true;
  dnsRecords.value = [];

  try {
    // 使用后端服务代理API请求
    const hostName = await getHostName("parap")
    const response = await tokenfetch(`${hostName}/auth/dnshe/subdomains/${selectedSubdomainId.value}/dns_records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      dnsRecords.value = data.records;
      alertRef.value.show(`成功获取 ${data.count} 条DNS记录`);
    } else {
      alertRef.value.show('查询DNS记录失败: ' + (data.message || '未知错误'));
    }
  } catch (error) {
    console.error('查询DNS记录时出错:', error);
    alertRef.value.show('查询DNS记录时出错: ' + error.message);
  } finally {
    dnsLoading.value = false;
  }
}
</script>

<style scoped>
.dnshe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dnshe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
  text-align: center;
}

.fetch-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.fetch-button {
  padding: 12px 20px;
  font-size: 16px;
  min-width: 150px;
}

.description {
  color: var(--c-text-light);
  font-size: 14px;
  margin: 0;
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

.query-section {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.query-button {
  padding: 12px 20px;
  font-size: 16px;
  min-width: 150px;
}

.dns-table-container {
  width: 100%;
  overflow-x: auto;
}

.dns-table-container h3 {
  color: var(--c-green);
  margin-bottom: 15px;
  text-align: center;
}

.dns-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.dns-table th,
.dns-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid var(--c-border);
}

.dns-table th {
  background-color: var(--c-green2);
  font-weight: bold;
  color: var(--c-text-dark);
}

.dns-table tr:last-child td {
  border-bottom: none;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

.status-active {
  background-color: #e6f7ee;
  color: #0a8528;
}

.status-inactive {
  background-color: #f7e6e6;
  color: #850a0a;
}

@media (max-width: 767px) {
  .dnshe-container {
    padding: 10px;
  }

  .dns-table {
    min-width: 800px;
  }

  .dns-table th,
  .dns-table td {
    padding: 8px 5px;
    font-size: 12px;
  }
}
</style>