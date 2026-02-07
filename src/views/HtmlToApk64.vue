<template>
    <div class="html-to-apk">
        <h1>HTML转APK工具</h1>
        <div class="container">
            <WebviewForm v-model="activeInput" v-model:url="webviewUrl" v-model:html="htmlContent"
                v-model:zipName="zipFileName" @zip-selected="handleZipSelected">
                <!-- APK配置部分 -->
                <div class="card">
                    <h3>APK信息</h3>
                    <div class="form-container">
                        <div class="form-row">
                            <div class="form-group">
                                <label>软件名称 (label)</label>
                                <div class="input-group">
                                    <input type="text" v-model="apkInfo.label" placeholder="请输入软件名称"
                                        class="input-field">
                                    <span class="field-desc">应用显示名称</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>版本号 (version_code)</label>
                                <div class="input-group">
                                    <input type="number" v-model="apkInfo.version_code" placeholder="请输入版本号"
                                        class="input-field">
                                    <span class="field-desc">APK版本号，用于应用更新</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>版本名称 (version_name)</label>
                                <div class="input-group">
                                    <input type="text" v-model="apkInfo.version_name" placeholder="请输入版本名称"
                                        class="input-field">
                                    <span class="field-desc">显示给用户的版本名称</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>包名 (package)</label>
                                <div class="input-group">
                                    <input type="text" disabled="true" v-model="apkInfo.package"
                                        placeholder="com.example.app" class="input-field">
                                    <span class="field-desc">应用唯一标识符</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 图标上传部分 -->
                <div class="card">
                    <h3>应用图标</h3>
                    <div class="form-container">
                        <div class="form-group">
                            <label>上传图标文件</label>
                            <div class="input-group">
                                <FileUpload ref="iconUploadRef" v-model="iconFileName" accept=".png"
                                    placeholder="选择PNG图标文件或拖拽至此" icon="🖼️" @file-selected="handleIconSelected" />
                                <span class="field-desc">仅支持PNG格式，尺寸要求256×256或512×512像素</span>
                            </div>
                        </div>
                    </div>
                </div>
            </WebviewForm>

            <Btn @click="generateApk" :loading="isGenerating">
                {{ isGenerating ? '生成中...' : '生成APK' }}
            </Btn>
        </div>
        <Alert ref="alertRef" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WebviewForm from '@/components/WebviewForm.vue'
import Btn from '@/components/Btn.vue'
import FileUpload from '@/components/FileUpload.vue'
import { getHostName, downloadFile } from '@/utils/dev'
import Alert from '@/components/Alert.vue'

// 状态管理
const activeInput = ref('url')
const webviewUrl = ref('')
const htmlContent = ref('')
const zipFileName = ref('')
const zipFile = ref<File | null>(null)
const isGenerating = ref(false)

const apkInfo = ref({
    label: 'WebViewDemo',
    version_code: 1,
    version_name: '1.0.0',
    package: 'com.example.webviewdemo'
})

// 图标文件相关
const iconFile = ref<File | null>(null)
const iconFileName = ref('')
const soFile = ref<File | null>(null)

// 图标文件引用
const iconUploadRef = ref()

// 添加 alert 组件引用
const alertRef = ref()

// 切换输入类型
const switchInput = (type: 'url' | 'html' | 'zip') => {
    activeInput.value = type
}

// 处理ZIP文件选择
const handleZipSelected = (file: File) => {
    zipFile.value = file
    zipFileName.value = file.name

    // 如果是.so文件，也保存到soFile
    if (file.name.endsWith('.so')) {
        soFile.value = file
    }
}

// 处理图标文件选择
const handleIconSelected = async (file: File) => {
    // 验证文件类型（仅支持PNG）
    if (file.type !== 'image/png') {
        alertRef.value.show('请上传 PNG 格式的图片文件')
        // 清空选择
        if (iconUploadRef.value) {
            iconUploadRef.value.selectedFile = null
        }
        iconFileName.value = ''
        return
    }

    // 验证文件大小 (限制为 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alertRef.value.show('图标文件大小不能超过 2MB')
        // 清空选择
        if (iconUploadRef.value) {
            iconUploadRef.value.selectedFile = null
        }
        iconFileName.value = ''
        return
    }

    // 验证图片尺寸（256x256 或 512x512）
    try {
        const img = new Image()
        img.onload = () => {
            const validSizes = [
                { width: 256, height: 256 },
                { width: 512, height: 512 }
            ]

            const isValidSize = validSizes.some(size =>
                img.width === size.width && img.height === size.height
            )

            if (!isValidSize) {
                alertRef.value.show('图标尺寸必须为 256×256 或 512×512 像素')
                // 清空选择
                if (iconUploadRef.value) {
                    iconUploadRef.value.selectedFile = null
                }
                iconFileName.value = ''
                return
            }

            // 尺寸验证通过，保存文件
            iconFile.value = file
        }

        img.onerror = () => {
            alertRef.value.show('无法读取图片文件')
            if (iconUploadRef.value) {
                iconUploadRef.value.selectedFile = null
            }
            iconFileName.value = ''
        }

        // 读取图片
        const reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    } catch (error) {
        alertRef.value.show('图片验证失败')
        if (iconUploadRef.value) {
            iconUploadRef.value.selectedFile = null
        }
        iconFileName.value = ''
    }
}

// 格式化URL
const formatUrl = (url: string) => {
    if (!url) return url
    url = url.trim()
    // 如果是相对路径或者没有协议前缀，添加 https://
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
        return `https://${url}`
    }
    return url
}

// 生成APK
const generateApk = async () => {
    if (!validateInputs()) {
        return
    }

    isGenerating.value = true
    try {
        // 构建请求数据
        const requestData: any = {
            version_code: apkInfo.value.version_code,
            version_name: apkInfo.value.version_name,
            label: apkInfo.value.label,
            package: apkInfo.value.package
        }

        // 添加内容数据
        if (activeInput.value === 'url' && webviewUrl.value) {
            requestData.url = formatUrl(webviewUrl.value)
        } else if (activeInput.value === 'html' && htmlContent.value) {
            // 将HTML内容转换为base64字符串
            const htmlEncoder = new TextEncoder()
            const htmlBytes = htmlEncoder.encode(htmlContent.value)
            requestData.html_file = btoa(String.fromCharCode(...htmlBytes))
        } else if (activeInput.value === 'zip' && zipFile.value) {
            // 将ZIP文件转换为base64字符串
            const zipArrayBuffer = await zipFile.value.arrayBuffer()
            const zipBytes = new Uint8Array(zipArrayBuffer)
            requestData.zip_file = btoa(String.fromCharCode(...zipBytes))
        } else {
            throw new Error('No valid content selected')
        }

        // 添加SO文件（如果存在）
        if (soFile.value) {
            const soArrayBuffer = await soFile.value.arrayBuffer()
            const soBytes = new Uint8Array(soArrayBuffer)
            requestData.so_file = btoa(String.fromCharCode(...soBytes))
        }

        // 添加图标文件（如果存在）
        if (iconFile.value) {
            const iconArrayBuffer = await iconFile.value.arrayBuffer()
            const iconBytes = new Uint8Array(iconArrayBuffer)
            requestData.icon_file = btoa(String.fromCharCode(...iconBytes))
        }

        const hostName = await getHostName("api")
        const response = await fetch(`${hostName}/html2apk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error_message || 'APK生成失败')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error_message || 'APK生成失败')
        }

        // 处理返回的APK文件
        // @ts-ignore
        if (window.wvPort) {
            const blob = await response.text()
            alertRef.value.show(blob)
        } else {
            // 将base64转换为blob
            const apkBlob = base64ToApkBlob(result.apk_content)
            const fileName = result.filename || 'webview.apk'
            downloadFile(apkBlob, fileName)
        }
    } catch (error: any) {
        console.error('APK generation failed:', error)
        alertRef.value.show(error.message || 'APK生成失败！')
    } finally {
        isGenerating.value = false
    }
}

// 验证输入
const validateInputs = () => {
    if (!apkInfo.value.label) {
        alertRef.value.show('请输入软件名称')
        return false
    }

    if (!apkInfo.value.version_name) {
        alertRef.value.show('请输入版本名称')
        return false
    }

    if (!apkInfo.value.package) {
        alertRef.value.show('请输入包名')
        return false
    }

    // 验证包名格式
    const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/
    if (!packageRegex.test(apkInfo.value.package)) {
        alertRef.value.show('包名格式不正确，请使用类似 com.example.app 的格式')
        return false
    }

    if (activeInput.value === 'url') {
        if (!webviewUrl.value) {
            alertRef.value.show('请输入网址')
            return false
        }
        webviewUrl.value = formatUrl(webviewUrl.value)
    }

    if (activeInput.value === 'html' && !htmlContent.value) {
        alertRef.value.show('请输入HTML源码')
        return false
    }

    if (activeInput.value === 'zip' && !zipFile.value) {
        alertRef.value.show('请选择ZIP文件')
        return false
    }

    return true
}

// base64转blob工具函数
function base64ToApkBlob(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }

    return new Blob([bytes], {
        type: 'application/vnd.android.package-archive'
    })
}

</script>

<style scoped>
.html-to-apk {
    max-width: 800px;
    margin: 0 auto;
    padding: 15px;
}

.container {
    display: grid;
    gap: 15px;
}

/* 添加配置表单样式 */
.form-container {
    padding: 0 15px;
}

.form-row {
    display: flex;
    gap: 15px;
    justify-content: space-between;
}

.form-group {
    flex: 1;
    min-width: 0;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--c-text-1);
    font-size: 0.9em;
}

.input-group {
    width: 100%;
}

.field-desc {
    display: block;
    font-size: 0.8em;
    color: var(--c-text-2);
    margin-top: 4px;
}



@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 15px;
    }
}
</style>