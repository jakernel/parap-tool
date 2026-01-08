<template>
  <div class="email-form">
    <div class="tooltip-container">
      <h2>Send Email</h2>
      <div class="tooltip-content">
        <div>
          no-replay@parap.us.kg
          通过zoho企业账号发送,
          不会显示主账号的地址,
          QQ提示:此地址未验证，请注意识别
        </div>
        <div>
          notify@parap.us.kg
          通过原账号发送的,
          会显示主账号的地址(代发),
          QQ无提示
        </div>
        <div>他们都通过了SPF,DKIM,DMARC的验证</div>
        <div>mail-tester 测试为满分</div>
      </div>
    </div>

    <form @submit.prevent="sendEmail">
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

const emailData = ref({
  from: "no-replay@parap.us.kg",
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

async function sendEmail() {
  loading.value = true
  try {
    const hostName = await getHostName('parap');
    const response = await tokenfetch(hostName + "/auth/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData.value)
      },
    );
    if (response.ok) {
      const result = await response.json();
      successMessage.value = result.message
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

<script setup>
</script>