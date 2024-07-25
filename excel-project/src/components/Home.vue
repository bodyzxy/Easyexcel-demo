<script setup name="home">
import { searchTitle } from '@/api/title';
import { onMounted, ref } from 'vue';
import LuckyExcel from 'luckyexcel';
import {exportExcel} from '@/commton/export';

const titles = ref([]);
const containerRef = ref<HTMLElement | undefined>(undefined)
const fatchTitles = async() =>{
    try{
        const response = await searchTitle();
        if(response != null){
            titles.value = response;
        }
    } catch(error){
        console.error('Error fetching titles:', error);
    }
};

const handleClose = (index) =>{
    titles.value.splice(index, 1);
}

//导入excel
const loadExcel = (evt) => {
    const files = evt.target.files
    if(files == null || files.length == 0){
        alert('请上传文件')
        return
    }

    let name = files[0].name
    let suffixArr = name.split('.'),
    suffix = suffixArr[suffixArr.length - 1]
    if (suffix != 'xlsx') {
        alert('只能导入xlsx文件格式的Excel')
        return
    }
    LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert('导入失败')
            return
        }
        window.luckysheet.destroy()
        window.luckysheet.create({
            container: 'luckysheet', //容器的id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator
        })
    })
}

const triggerFileInput = () => {
    document.getElementById('uploadBtn').click();
};

function upload(){
    exportExcel(luckysheet.getAllSheets(),'xxxxxx')
}

onMounted(() => {
    fatchTitles();

    document.getElementById('customUploadBtn').addEventListener('click',triggerFileInput);

    luckysheet.create({
    container: 'luckysheet'//这里需要和容器的id名称一致
  })
});

</script>

<template class="app">
    <div class="container">
        <n-affix
        :trigger-top="50"
        position="absolute"
        :listen-to="() => containerRef"
        >
            <div class="title">
                <div class="avatar-container">
                    <n-avatar
                    round
                    size="large"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    class="image"
                    ></n-avatar>
                </div>
                <n-divider/>
                <n-button class="button">用户信息</n-button>
            </div>
        </n-affix>
        <div class="right">
            <n-layout class="layout">
                <n-layout-header>
                    <n-space>
                        <n-tag :key="index" v-for="(title, index) in titles" type="success" closable @close="handleClose(index)">
                            {{ title }}
                        </n-tag>
                    </n-space>
                </n-layout-header>
            </n-layout>
            <n-divider/>
            <input id="uploadBtn" type="file" @change="loadExcel" class="input" style="display: none;"/>
            <n-float-button :right="10" :bottom="100" shape="square" id="customUploadBtn" class="custom-button" style="width: 60px; height: 60px; z-index: 9999;">
                导入
            </n-float-button>
            <div id="luckysheet" class="luckysheet-wrap"></div>
            <n-float-button :right="10" :bottom="20" shape="square" class="upload" style="width: 60px; height: 60px; z-index: 9999;" @click="upload()">
                导出
            </n-float-button>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
}
.title{
    background-color: aqua;
    width: 150px;
    height: 900px;
    margin-top: 30px;
    margin-left: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
}

.image{
    margin-top: 40px;
}
.avatar-container {
    display: flex;
    justify-content: center; /* Center the avatar horizontally */
    margin-top: 40px;
}
.button{
    width: 100%;
    height: 5%;
}
.right{
    flex-grow: 1; /* 占据剩余空间 */
    /* background-color: aqua; 可以根据需要设置背景色 */
    height: 900px; /* 根据需要调整高度 */
    margin-top: 30px;
    margin-left: 20px; /* 确保与 .title 之间有间距 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
}
.layout{
    height: 10%;
}
.upload{
    background-color: aqua;
}
.luckysheet-wrap {
  width: 100%;
  height: 85%;
}
</style>