<template>
  <div class="email-form">
    <div class="tooltip-container">
      <h2>Send Email</h2>
      <div class="tooltip-content">
        <div>
          lark ok
          aws 未过验证
          google /网易 本地 ok,服务器不行
          google 本地测试要开代理/ DKIM,DMARC 未过验证
        </div>
      </div>
    </div>

    <form @submit.prevent="sendEmail">
      <div class="form-group">
        <label for="emailProvider">邮件服务商:</label>
        <select id="emailProvider" v-model="selectedProvider" @change="updateFromEmail" required>
          <option v-for="(provider, key) in emailProviders" :key="key" :value="key">
            {{ provider.name }} ({{ provider.email }})
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="fromEmail">发件人:</label>
        <input type="email" id="fromEmail" v-model="emailData.from" required placeholder="Enter recipient email"
          disabled />
      </div>
      <div class="form-group">
        <label for="toEmail">收件人:</label>
        <input type="email" id="toEmail" v-model="emailData.to[0]" required placeholder="Enter recipient email" />
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input type="text" id="subject" v-model="emailData.subject" required placeholder="Enter email subject" />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" v-model="emailData.html" required placeholder="Enter your message"></textarea>
      </div>
      <Btn type="submit" :loading="loading">
        Send
      </Btn>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div v-html="emailData.html"></div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import Btn from "@/components/Btn.vue";
import { useRouter } from "vue-router";
import { getHostName, tokenfetch } from '@/utils/dev';

// Define email providers with their configurations
const emailProviders = {
  qq_notify: {
    name: "腾讯企业邮箱",
    email: "notify@pzx.de5.net",
    smtpHost: "smtp.exmail.qq.com",
    smtpPort: 465,
    source: "Tencent Corporate Email"
  },
  qq_no_reply: {
    name: "腾讯企业邮箱",
    email: "no-reply@pzx.de5.net",
    smtpHost: "smtp.exmail.qq.com",
    smtpPort: 465,
    source: "Tencent Corporate Email"
  },
  ali: {
    name: " 阿里",
    email: "admin@para.us.ci",
    smtpHost: "smtp.qiye.aliyun.com",
    smtpPort: 465,
    source: "Ali Corporate Email"
  },
  wangyi: {
    name: "网易",
    email: "para@pzx.cc.cd",
    smtpHost: "smtphz.qiye.163.com",
    smtpPort: 465,
    source: "Wangyi 163 Corporate Email"
  },
  aws: {
    name: "AWS SES",
    email: "notify@paa.cc.cd",
    smtpHost: "email-smtp.us-east-2.amazonaws.com",
    smtpPort: 587,
    source: "Amazon Web Services SMTP"
  },
  google: {
    name: "Google",
    email: "admin@paa.cc.cd",
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    source: "Google Gmail SMTP"
  },
  lark_admin: {
    name: "Lark_admin",
    email: "admin@pzx.us.ci",
    smtpHost: "smtp.larksuite.com",
    smtpPort: 465,
    source: "Ali Lark SMTP"
  },
  lark_share: {
    name: "Lark_share",
    email: "noreply@pzx.us.ci",
    smtpHost: "smtp.larksuite.com",
    smtpPort: 465,
    source: "Ali Lark SMTP"
  }
}

const selectedProvider = ref('lark_admin')

const emailData = ref({
  from: "para@pzx.cc.cd",
  to: ['pzx521521@qq.com'],
  subject: 'Vertify Code',
  html: `
<body style="font-family: 'Arial', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="background: #acd4e7; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2>Verification Code</h2>
        <div style="font-size: 24px; letter-spacing: 3px; background-color: #e1e8ed; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold; color: #333;">
            7G5HJ
        </div>
    </div>
</body>
`
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const router = useRouter()

// Update from email based on selected provider
function updateFromEmail() {
  if (selectedProvider.value && emailProviders[selectedProvider.value]) {
    emailData.value.from = emailProviders[selectedProvider.value].email
  }
}
updateFromEmail();
async function sendEmail() {
  loading.value = true
  try {
    const hostName = await getHostName('vercel');
    const response = await tokenfetch(hostName + "/auth/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...emailData.value,
          provider: selectedProvider.value
        })
      },
    );
    if (response.ok) {
      const result = await response.json();
      successMessage.value = result.message
      errorMessage.value = ''
    } else if (response.status === 401) {
      localStorage.clear()
      router.push("/login")
    } else {
      errorMessage.value = 'Failed to send email.'
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.email-form {
  max-width: 500px;
  margin: 5px auto;
  padding: 20px;
  background-color: var(--c-bg-soft);
  color: var(--c-text);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: var(--c-text);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: var(--c-text);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: var(--c-text);
  background: var(--c-bg-soft);
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #28a745;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: var(--c-text);
  background: var(--c-bg-soft);
  transition: border-color 0.3s ease;
  cursor: pointer;
}

.success {
  text-align: center;
  color: #28a745;
  margin-top: 20px;
}

.error {
  text-align: center;
  color: red;
  margin-top: 20px;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  text-align: center;
}

.tooltip-content {
  text-align: left;
  visibility: hidden;
  width: 400px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  left: 0;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  top: 100%;
  margin-top: 5px;
}

.tooltip-container:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}
</style>