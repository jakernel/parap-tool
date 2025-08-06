<template>
  <div class="qd-container">
    <div class="qd-form">
      <textarea v-model="inputText" placeholder="请输入内容..." class="qd-input" rows="8"
        style="width: 100%; resize: vertical; font-size: 16px; padding: 12px;"></textarea>
      <div class="qd-buttons">
        <Btn :loading="loading" @click="handleSubmit" class="qd-button">
          提交
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

const inputText = ref(`POST /argus/api/v1/video/adv/finishWatch HTTP/1.1
Host: h5.if.qidian.com
Content-Length: 146
ibex: UcCNQhlWpTbd2eDIU_rMPqjMcZwE4zCGhLJpetg_17k6K230SyLMb6GddHWJMhfiLZOZ8X-I4DRb265RohbLsaBHIKizalyfcSAL8EbhlQOhK-RPzlNWhqJGg9FCQ1NS5MmMS8A3or-D9lYHnvhbTWx6J9rpKDK4pGKFrEuhHyaVzKiItXArxyEcXPd3eDucAWaZFOqJxxJCDbOf4ah_fUjpDkCtqePAz019HE4TNShmc_R7o5wj-XZdBNH5yK2gIkMwaaA_Fwn_Bu5_KCQeIRzaabBlfpba8wOoOa7SoDfGU3wQKWrsAlVblyxLwtyrCbqCMwKR91jkrt-1-O2vjW_PycfCpjw4Xnk6HBDfW06WDnXKVftSDMG-Ds4eNFaQF8fl58eoNSSA-4FMruF2ISGazPMIpPQeeQoaXoKAqMZA-FUgC-JjmK2CTjFsAP3iWNYj2P3kq4dhZGY4ZjExZjIxYWZiNmNmYjQ4ODViMTA2ZmVkOWM4Yg==
User-Agent: Mozilla/5.0 (Linux; Android 14; 2106118C Build/UKQ1.231207.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.86 MQQBrowser/6.2 TBS/047823 Mobile Safari/537.36 QDJSSDK/1.0  QDNightStyle_1  QDReaderAndroid/7.9.420/1656/1002140/Xiaomi/QDShowNativeLoading
SDKSign: fwU0VSlfsV9boLwdRxTi/iEtk49Py0XNnaqW6Sl0Fdrghw+Ea9kQt8XrIehg VIfIThxUMonbp3gBKraGUp7GnDaMgS0b+p7fbgPAL61x5gaBVouhG+00tSXy RiBi19mMdmwY+UX1/bLczy9gvtgz84Dbh6tRbhxGKYb6PS7Wew3G1z5chF+X Yyz8g4upFlrZ3m26E/+4r4U=
tstamp: 1754502560064
Content-Type: application/x-www-form-urlencoded
Accept: application/json, text/plain, */*
helios: 1
borgus: 4280009a2669baeb55ce9af9b0d046e6
Origin: https://h5.if.qidian.com
X-Requested-With: com.qidian.QDReader
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://h5.if.qidian.com/new/welfareCenter/?_viewmode=0
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
Cookie: ywguid=120154865151; appId=12; areaId=30; lang=cn; mode=normal; bar=104; qid=c517bf9e55d98d04b89bfe8c10001ab17310; uuid=1736957143242645; _csrfToken=aBPgouXqNWZwLd3KVCJ6rJTPMLrN9N7iArRoFudy; newstatisticUUID=1737536871_1484997724; fu=1063664931; qidth=caa8f0c6ffb801753eddeb87100017417310; PHPSESSID=1d731535f2092fd8591e22b7c4aed501; ywkey=ykAJPC3xEdkJ; cmfuToken=N((RYkkLXQNeZlOAcbu1KeHdUuf44JfEmKXRhiwGIpf1iNZsp3ux4RQSoNxSjcv54dmDJpSgHNIoDppttCk0o4WfW02akUH4ktPAHU0AcCJhYWKp8PCe-Q3NaJz932q1eezdj5KSLS0Iwg8Y2NR2gJMNkDTBy745ylW5bxqSbRlYY-eUu1dsqZ19pbYNQOHf_fI1gyk49qreckCE81JRB6QeqcZF_Q8hyIR1fuijBnPFBbcKxAS4JqH2o99f9t14g9-hhr_X6Yik-01; QDInfo=SO+aPyWTJ02k4C9FkkB29fACDXIsJx4pAGbhVI07D8hjHPOEsCFgpKs6sLj9MLaOMad0nLWkjLZiPGzrYzIs3aToDVNBVw9rru4owdN+fTUJ1mfNNfX+Cf/Jmpzp3FOyeRsYzY8OzU29Sk1ERBjumBQCPuAjlIrqd+JbH1OKniv7JisKtatlDiu1B1WnoFPR3JOL2724igJyD3qXtZB/8xQrjiIp4AUnK9obRhk5OXwqNw+qVgD/azb+dQnBWo1sXz2px2har7FnPZzOVOMZZ2pQQaY33a8N/K6DaG79eYpBF+Rrel6e7Q==
Connection: keep-alive

taskId=942012606129700866&banId=0&banMessage=&captchaAId=&captchaType=0&captchaURL=&challenge=&gt=&newCaptcha=0&offline=0&phoneNumber=&sessionKey=`)
const loading = ref(false)
// 添加 alert 组件引用
const alertRef = ref()

// 清除输入内容的函数
const clearInput = () => {
  inputText.value = ''
}

const handleSubmit = async () => {
  if (inputText.value.trim() === "") {
    alert('请输入内容')
    return
  }

  loading.value = true


  // 解析输入内容
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
  // 输出json
  const hostName = await getHostName("qdapi")
  const response = await fetch(`${hostName}/tool/qdapi`, {
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
  if (!response.ok) {
    alertRef.value.show('提交失败！'+ data)
    loading.value = false;
  }else{
    
    inputText.value = '';
    loading.value = false;
    alertRef.value.show('提交成功！'+JSON.stringify(data))
  }
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

  .qd-button {
    min-width: 100px;
    padding: 10px 20px;
    font-size: 14px;
  }

  .qd-clear-button {
    min-width: 100px;
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>