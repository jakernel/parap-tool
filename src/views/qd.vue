<template>
  <div class="qd-container">
    <div class="qd-form">
      <textarea v-model="inputText" placeholder="请输入内容..." class="qd-input" rows="8"
        style="width: 100%; resize: vertical; font-size: 16px; padding: 12px;"></textarea>
      <div class="qd-buttons">
        <Btn :loading="metaLoading" @click="handleMetaSubmit" class="qd-button">
          校验
        </Btn>
        <Btn :loading="loading" @click="handleSubmit" class="qd-button">
          签到
        </Btn>
        <Btn @click="clearInput" class="qd-clear-button">
          清除
        </Btn>
      </div>
    </div>
    <Alert ref="alertRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Btn from "@/components/Btn.vue";
import { getHostName } from '@/utils/dev'
import Alert from '@/components/Alert.vue'

const inputText = ref(`GET /argus/api/v2/readtime/readpage HTTP/1.1
Host: h5.if.qidian.com
Connection: keep-alive
Accept: application/json, text/plain, */*
ibex: 1tl-WCSpZQWdw7g1BJlas9B8_LAjD9idMZxB5drGru8ybCJzWLARjC3toKnWkwPFNtvsj4qJJDb1ij6WPR3hj7VvrdoZXaKZi_vXGD_EXIaIwQ0tDJ4JFA_GW8bSzf2viGQCi5se9Q89JxlxIa-x5_FA3feAjdTzhzAj8f5egLaU5buGKlANCnSrLHjiiUylNc5e67TXUWIRuI79SFc3kWpiGonBfMWfrHPSKnjdSzQHIS7OK2_5Iyp6URkzTvX0uEnQlPbYxjNl82RqH0IIWdMrYpFsjUhhDWLY5Gd_jE14FEYttJ9M0YeJdTr7TLFSwtAL95DujB_106qpBy4AEq7f74Mp6Y-US1tStIAhy_vh6jQ4-cYlDdnlYr3b4tgPv76efHuiJTG2Lo9TalO-n9SOYKhbg1mXaztgNe2-3UXrxHli9ZdW6DW7oSe6L7PCq3Z2o3-XScN5W4V0MW-vBfnsfflGgd8T6VLHVIN0rQ0xY2IxM2VhMzk3NGY2NWRiN2M1MDI5OGMwMjZjZGVlZQ==
helios: 1
User-Agent: Mozilla/5.0 (Linux; Android 14; 2106118C Build/UKQ1.231207.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.86 MQQBrowser/6.2 TBS/047823 Mobile Safari/537.36 QDJSSDK/1.0  QDNightStyle_2  QDReaderAndroid/7.9.420/1656/1002138/Xiaomi/QDShowNativeLoading
SDKSign: fwU0VSlfsV9rZ0xVU9kOVRVDsoJ3m8Is3SyZGCJuB3Pb0ZtvCtelTkRRlDSc QphyfDpy21t8PLSB/LG1QJQZbmfLzJ55Pe7LpTJG4/LojedYAY1HGGVM0Afc m2ZdBIrbgdmwmhjyUfqpERGgn1OOyk/3HMNkZ1kbupQBJdhS6TY6SIRXaCIv zxxZF91VCplwJ3jHNU3SDVg=
borgus: d18d9ec6600bb6959bcd7beaa1e945fe
tstamp: 1767749769366
X-Requested-With: com.qidian.QDReader
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://h5.if.qidian.com/new/welfareCenter/?_viewmode=0
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Cookie: appId=12; areaId=30; lang=cn; mode=normal; bar=104; qid=c517bf9e55d98d04b89bfe8c10001ab17310; qidth=caa8f0c6ffb801753eddeb87100017417310; uuid=1758058048048519.8581786001893; PHPSESSID=8fd1c0fa63fb8b6dcffb2c72345aea4a; ywguid=120154865151; newstatisticUUID=1765047449_1132777839; _csrfToken=EDEny9WdlNdoPE09MbUbwMjNEPdWsk9stu6lcA1g; ywkey=ywxQHa9Kf6Y2; cmfuToken=N((O1X2pLUvKgzo-InNAwPH9pnOS_EWVqGrdKRoLKagIQZGFp0uyioEdCaR5eBSuMOgoGZJnuaiIG9DDLFb_W_ZKCT4CnGNVYwAACrPf82zSLov9LcnVl30N4w3jWwE6QU2aQkXAECVG0YNnEGsckMdZ4Qjr_vgMOQz2XYQI-YupsE03ZqjFio4EzAye4Hl1DIwzdO_18335fZZ3fbjBxkWMxvNTlfBZ-YCFCsYbSmOFGBFlBETaOmeli1WBvcbwGrAjlx8f7tAUOc1; QDInfo=SO+aPyWTJ02k4C9FkkB29fACDXIsJx4pAGbhVI07D8hjHPOEsCFgpKs6sLj9MLaOMad0nLWkjLYK1CmfiqshWDInjUPKO9I0m2m6h/af2OyZptx00I0vIMPBUc0X/Kvlp2KScR9ZubHiNpD6Ny5PitpF7W+D3Aeengmq2Ktk3aC2mVWLJjBOafDLA1HSz103jWXmU0u96OigRUrQOgq0C7ZEm11o3K1IiDKIIE/xyW7PaKiWsGU01dN9pxmYiPXP3GO0Tg6qv2mKxlNGymlTGlVWTQQJ8ippyH8ocgwVDFGHKu0lNTvDrA==
`)
const loading = ref(false)
const metaLoading = ref(false)
// 添加 alert 组件引用
const alertRef = ref()

// 清除输入内容的函数
const clearInput = () => {
  inputText.value = ''
}

// 提取公共的解析函数
const parseInputText = () => {
  const lines = inputText.value.split('\n');
  const result = {
    qdInfo: "",
    sdkSign: "",
    ywKey: "",
    ywGuid: "",
    ibex: "",
    taskType: []
  };

  // 通用解析头部和Cookie字段，忽略大小写，字段名参考后端结构
  // QdInfo, SdkSign, YwKey, YwGuid, Ibex
  for (let line of lines) {
    line = line.trim();
    // 处理 key: value 形式
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const value = line.slice(colonIdx + 1).trim();
      if (key === "qdinfo") {
        result.qdInfo = value;
      } else if (key === "sdksign" || key === "qdsign") {
        result.sdkSign = value;
      } else if (key === "ywkey") {
        result.ywKey = value;
      } else if (key === "ywguid") {
        result.ywGuid = value;
      } else if (key === "ibex") {
        result.ibex = value;
      } else if (key === "cookie") {
        // 解析Cookie字段
        const cookies = value.split(';');
        for (const cookie of cookies) {
          // 只在第一个=处分割，避免qdinfo等值中包含=被截断
          const eqIdx = cookie.indexOf('=');
          if (eqIdx > 0) {
            const k = cookie.slice(0, eqIdx).trim();
            const v = cookie.slice(eqIdx + 1).trim();
            if (!k || !v) continue;
            const kLower = k.toLowerCase();
            if (kLower === "qdinfo") result.qdInfo = v;
            if (kLower === "ywkey") result.ywKey = v;
            if (kLower === "ywguid") result.ywGuid = v;
          }
        }
      }
    } else {
      // 处理 key=value 形式
      const eqIdx = line.indexOf("=");
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim().toLowerCase();
        // 只在第一个;处分割，保留=后所有内容（如qdinfo的==）
        let value = line.slice(eqIdx + 1).trim();
        const semiIdx = value.indexOf(';');
        if (semiIdx >= 0) {
          value = value.slice(0, semiIdx).trim();
        }
        if (key === "qdinfo") {
          result.qdInfo = value;
        } else if (key === "sdksign" || key === "qdsign") {
          result.sdkSign = value;
        } else if (key === "ywkey") {
          result.ywKey = value;
        } else if (key === "ywguid") {
          result.ywGuid = value;
        } else if (key === "ibex") {
          result.ibex = value;
        }
      }
    }
  }

  // 解析所有行，找出taskType
  result.taskType = [1, 2, 3, 4]
  return result;
}

// 通用的API请求函数
const makeRequest = async (endpoint, successCallback) => {
  if (inputText.value.trim() === "") {
    alert('请输入内容')
    return
  }

  // 设置对应的loading状态
  if (endpoint === '/tool/qd/checkIn') {
    loading.value = true
  } else if (endpoint === '/tool/qd/checkMeta') {
    metaLoading.value = true
  }

  // 解析输入内容
  const result = parseInputText()

  // 发送请求
  const hostName = await getHostName("qdapi")
  const response = await fetch(`${hostName}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // 重置对应的loading状态
  if (endpoint === '/tool/qd/checkIn') {
    loading.value = false
  } else if (endpoint === '/tool/qd/checkMeta') {
    metaLoading.value = false
  }

  if (!response.ok) {
    alertRef.value.show('提交失败！' + data)
  } else {
    successCallback(data)
  }
}

const handleSubmit = async () => {
  await makeRequest('/tool/qd/checkIn', showCheckInResult)
}

// 新增处理 checkMeta 的函数
const handleMetaSubmit = async () => {
  await makeRequest('/tool/qd/checkMeta', showMetaResult)
}

// 专门用于展示checkIn结果的函数
const showCheckInResult = (data) => {
  let resultHtml = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';

  resultHtml += '<h3 style="color: #42b983;">签到结果</h3><ul>';

  if (data.appVersion) {
    resultHtml += `<li><strong>应用版本:</strong> ${data.appVersion}</li>`;
  }

  if (data.userId) {
    resultHtml += `<li><strong>用户ID:</strong> ${data.userId}</li>`;
  }

  if (data.deviceId) {
    resultHtml += `<li><strong>设备ID:</strong> ${data.deviceId}</li>`;
  }

  if (data.status) {
    resultHtml += `<li><strong>状态:</strong> ${data.status}</li>`;
  }

  if (data.active !== undefined) {
    resultHtml += `<li><strong>是否成功:</strong> ${data.active}</li>`;
  }

  if (data.taskType && Array.isArray(data.taskType)) {
    resultHtml += `<li><strong>任务类型:</strong> [${data.taskType.join(', ')}]</li>`;
  }

  resultHtml += '</ul>';
  resultHtml += '</div>';

  alertRef.value.showHtml(resultHtml);
}

// 专门用于展示meta结果的函数
const showMetaResult = (data) => {
  let resultHtml = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';

  // 显示YwGuid和YwKey
  if (data.YwGuid) {
    resultHtml += `<p><strong>YwGuid:</strong> ${data.YwGuid}</p>`;
  }

  if (data.YwKey) {
    resultHtml += `<p><strong>YwKey:</strong> ${data.YwKey}</p>`;
  }

  if (data.ibex) {
    resultHtml += '<h3 style="color: #42b983;">设备信息 (ibex)</h3><ul>';
    for (const [key, value] of Object.entries(data.ibex)) {
      resultHtml += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    resultHtml += '</ul>';
  }

  if (data.qdInfos) {
    resultHtml += '<h3 style="color: #42b983;">签到信息 (qdInfos)</h3><ul>';
    for (const [key, value] of Object.entries(data.qdInfos)) {
      resultHtml += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    resultHtml += '</ul>';
  }

  if (data.sdkSign) {
    resultHtml += '<h3 style="color: #42b983;">SDK签名信息 (sdkSign)</h3><ul>';
    for (const [key, value] of Object.entries(data.sdkSign)) {
      resultHtml += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    resultHtml += '</ul>';
  }

  if (Object.keys(data).length === 0) {
    resultHtml += '<p>没有返回数据</p>';
  }

  resultHtml += '</div>';

  alertRef.value.showHtml(resultHtml);
}
</script>

<style scoped>
.qd-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.qd-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  width: 100%;
}

.qd-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--c-green2);
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--c-bg);
  color: var(--c-text);
  transition: border-color 0.3s;
}

.qd-input:focus {
  outline: none;
  border-color: var(--c-green);
}

.qd-input::placeholder {
  color: var(--c-text-light);
}

.qd-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.qd-button {
  min-width: 120px;
  padding: 12px 24px;
  font-size: 16px;
}

.qd-clear-button {
  min-width: 120px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: var(--c-red);
  color: var(--c-text-light);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.qd-clear-button:hover {
  background-color: var(--c-red-dark);
}

@media (max-width: 767px) {
  .qd-container {
    min-height: 50vh;
    padding: 10px;
  }

  .qd-form {
    gap: 15px;
  }

  .qd-input {
    padding: 10px 14px;
    font-size: 14px;
  }

  .qd-buttons {
    flex-direction: column;
    align-items: center;
  }

  .qd-button {
    width: 100%;
    min-width: auto;
    padding: 10px 20px;
    font-size: 14px;
  }

  .qd-clear-button {
    width: 100%;
    min-width: auto;
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>