<template>
  <div class="email-form">
    <div class="tooltip-container">
      <h2>Send SMS</h2>
      <div class="tooltip-content">
        <p>
          This is a API form https://app.notificationapi.com/
        </p>
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
        <input id="toEmail" v-model="emailData.to[0]" required placeholder="Enter recipient email" />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" v-model="emailData.html" required placeholder="Enter your message"></textarea>
      </div>
      <div class="ct-r">
        <Btn type="submit" :loading="loading">
          Send
        </Btn>
      </div>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Btn from "@/components/Btn.vue";
import { useRouter } from "vue-router";
import { getHostName, tokenfetch } from '@/utils/dev';

const emailData = ref({
  from: "para",
  to: ['+8618868826592'],
  html: `hello`
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const router = useRouter()

async function sendEmail() {
  loading.value = true
  try {
    const hostName = await getHostName('parap');
    const response = await tokenfetch(hostName + "/auth/sms/send",
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