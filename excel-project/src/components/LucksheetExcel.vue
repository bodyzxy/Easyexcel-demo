<template>
    <a-card :bordered="false" :style="{ background: '#fff' }">
      <div id="luckysheet" :style="{ margin: '0px', padding: '0px', width: '100%', height: contentHeight + 'px' }" />
    </a-card>
  </template>
  
  <script setup>
  import { reactive, nextTick, onMounted, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import $script from 'scriptjs';
  import LuckyExcel from 'luckyexcel';

  const props = defineProps({
  fileData: {
    type: ArrayBuffer,
    required: true,
  },
  });

  const contentHeight = window.innerHeight - 230;
  
  const totalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  
  onMounted(() => {
  renderExcel();
  });
  const renderExcel = () => {
  if (props.fileData) {
    LuckyExcel.transformExcelToLucky(props.fileData, (exportJson) => {
      if (exportJson.sheets == null || exportJson.sheets.length === 0) {
        message.warning('无法读取excel的内容');
        return;
      }
      nextTick(() => {
        window.luckysheet.destroy();
        window.luckysheet.create({
          container: 'luckysheet',
          data: exportJson.sheets,
        });
      });
    });
  }
};

watch(() => props.fileData, renderExcel);
  
  const openExcel = ({ url, name }) => {
    nextTick(() => {
      LuckyExcel.transformExcelToLuckyByUrl(url, name, (exportJson, luckysheetfile) => {
        if (!exportJson.sheets || exportJson.sheets.length === 0) {
          message.warning('无法读取excel的内容');
          return;
        }
        const firstData = [];
        const secondData = {};
        for (let i = 0; i < exportJson.sheets.length; i++) {
          firstData[i] = {
            name: exportJson.sheets[i].name,
            index: exportJson.sheets[i].index,
            order: exportJson.sheets[i].order,
            status: exportJson.sheets[i].status,
            config: exportJson.sheets[i].config,
          };
          firstData[i].config.row = 10;
          if (parseInt(exportJson.sheets[i].status) === 1) {
            firstData[i].celldata = exportJson.sheets[i].celldata;
          }
          secondData[exportJson.sheets[i].index] = exportJson.sheets[i].celldata;
        }
        window.luckysheet.destroy();
        window.luckysheet.create({
          lang: 'zh',
          container: 'luckysheet',
          showtoolbar: false,
          showinfobar: false,
          showstatisticBar: true,
          sheetBottomConfig: false,
          allowEdit: false,
          enableAddRow: false,
          enableAddCol: false,
          sheetFormulaBar: false,
          data: exportJson.sheets,
          enableAddBackTop: true,
          title: exportJson.info.name,
          sheetRightClickConfig: {
            delete: false,
            copy: false,
            rename: false,
            color: false,
            hide: false,
            move: false,
          },
          showsheetbarConfig: {
            add: false,
          },
          devicePixelRatio: window.devicePixelRatio,
          defaultFontSize: 20,
          cellRightClickConfig: {
            copy: false,
            copyAs: false,
            paste: false,
            insertRow: false,
            insertColumn: false,
            deleteRow: false,
            deleteColumn: false,
            deleteCell: false,
            hideRow: false,
            hideColumn: false,
            rowHeight: false,
            columnWidth: false,
            clear: false,
            matrix: false,
            sort: false,
            filter: false,
            chart: false,
            image: false,
            link: false,
            data: false,
            cellFormat: false,
          },
        });
      });
    });
  };
  </script>