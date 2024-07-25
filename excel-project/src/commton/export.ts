import Excel, { type FillPattern, Workbook, type Worksheet, type Fill  } from 'exceljs';
import type{ Borders } from '@/commton/borders';
import {request} from '@/http/index';
import saveAs from 'file-saver';

interface LuckySheet {
  name: string;
  data: any[];
  config?: {
    merge?: { [key: string]: { r: number; c: number; rs: number; cs: number } };
    borderInfo?: { rangeType: string; borderType: string; style: number; color: string; range: any[]; value: any }[];
  };
}

const exportExcel = function (luckysheet: LuckySheet | LuckySheet[], value: string) {
  if (!Array.isArray(luckysheet)) {
    luckysheet = [luckysheet];
  }

  const workbook = new Excel.Workbook();

  luckysheet.forEach(function (table) {
    if (table.data.length === 0) return true;

    const worksheet = workbook.addWorksheet(table.name);
    const merge = table.config?.merge || {};
    const borderInfo = table.config?.borderInfo || [];

    setStyleAndValue(table.data, worksheet);
    setMerge(merge, worksheet);
    setBorder(borderInfo, worksheet);
    return true;
  });


  return workbook.xlsx.writeBuffer().then(async (data) => {
    const bold = new Blob([data], {type: 'application/vnd.ms-excel;charset=utf-8'});

    try{
        const response = await request.uploadFile('/user/excel/file', bold, `${value}.xlsx`);
        console.log(response.data);

         // 检查响应是否为 Blob 对象
        if (!(response instanceof Blob)) {
            console.error('响应不是 Blob 对象');
            return;
        }

        // 生成文件名称
        const filename = `${value}.xlsx`;

        // 使用 file-saver 保存文件
        saveAs(response, filename);
    } catch(Error){
        console.error(Error);
        throw Error;
    }
  })
};

const setMerge = function (luckyMerge: { [key: string]: { r: number; c: number; rs: number; cs: number } }, worksheet: Worksheet) {
  const mergearr = Object.values(luckyMerge);
  mergearr.forEach(function (elem) {
    worksheet.mergeCells(elem.r + 1, elem.c + 1, elem.r + elem.rs, elem.c + elem.cs);
  });
};

const setBorder = function (luckyBorderInfo: { rangeType: string; borderType: string; style: number; color: string; range: any[]; value: any }[], worksheet: Worksheet) {
  if (!Array.isArray(luckyBorderInfo)) return;
  luckyBorderInfo.forEach(function (elem) {
    if (elem.rangeType === 'range') {
      const border = borderConvert(elem.borderType, elem.style, elem.color);
      const rang = elem.range[0];
      const row = rang.row;
      const column = rang.column;
      for (let i = row[0] + 1; i < row[1] + 2; i++) {
        for (let y = column[0] + 1; y < column[1] + 2; y++) {
          worksheet.getCell(i, y).border = border;
        }
      }
    }
    if (elem.rangeType === 'cell') {
      const { col_index, row_index } = elem.value;
      const borderData = { ...elem.value };
      delete borderData.col_index;
      delete borderData.row_index;
      const border = addborderToCell(borderData, row_index, col_index);
      worksheet.getCell(row_index + 1, col_index + 1).border = border;
    }
  });
};



const setStyleAndValue = function (cellArr: any[][], worksheet: Worksheet) {
  if (!Array.isArray(cellArr)) return;
  cellArr.forEach(function (row, rowid) {
    row.every(function (cell, columnid) {
      if (!cell) return true;

      //   const fill = fillConvert(cell.bg); 
      const fill = {
        type: 'pattern',  // 确保这里使用的是字面量 'pattern'
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      } as Fill;
      const font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul);
      const alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
      let value: any = '';

      if (cell.f) {
        value = { formula: cell.f, result: cell.v };
      } else if (!cell.v && cell.ct && cell.ct.s) {
        cell.ct.s.forEach((arr: { v: string }) => {
          value += arr.v;
        });
      } else {
        value = cell.v;
      }

      const letter = createCellPos(columnid);
      const target = worksheet.getCell(letter + (rowid + 1));
      for (const key in fill) {
        target.fill = fill;
        break;
      }
      target.font = font;
      target.alignment = alignment;
      target.value = value;

      return true;
    });
  });
};

const fillConvert = function (bg: string): FillPattern | {} {
  if (!bg) {
    return {};
  }
  const fill: FillPattern = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: bg.replace('#', '') },
  };
  return fill;
};

const fontConvert = function (
  ff: number | string = 0,
  fc: string = '#000000',
  bl: number = 0,
  it: number = 0,
  fs: number = 10,
  cl: number = 0,
  ul: number = 0
): Partial<Excel.Font> {
  const luckyToExcel: { [key: string]: any } = {
    0: '微软雅黑',
    1: '宋体（Song）',
    2: '黑体（ST Heiti）',
    3: '楷体（ST Kaiti）',
    4: '仿宋（ST FangSong）',
    5: '新宋体（ST Song）',
    6: '华文新魏',
    7: '华文行楷',
    8: '华文隶书',
    9: 'Arial',
    10: 'Times New Roman ',
    11: 'Tahoma ',
    12: 'Verdana',
    num2bl: (num: number) => (num === 0 ? false : true),
  };

  const font: Partial<Excel.Font> = {
    name: typeof ff === 'number' ? luckyToExcel[ff] : ff,
    family: 1,
    size: fs,
    color: { argb: fc.replace('#', '') },
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl),
  };

  return font;
};

const alignmentConvert = function (
  vt: string = 'default',
  ht: string = 'default',
  tb: string = 'default',
  tr: string = 'default'
): Partial<Excel.Alignment> {
  const luckyToExcel: { [key: string]: any } = {
    vertical: {
      0: 'middle',
      1: 'top',
      2: 'bottom',
      default: 'top',
    },
    horizontal: {
      0: 'center',
      1: 'left',
      2: 'right',
      default: 'left',
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false,
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: 'vertical',
      4: 90,
      5: -90,
      default: 0,
    },
  };

  const alignment: Partial<Excel.Alignment> = {
    vertical: luckyToExcel.vertical[vt],
    horizontal: luckyToExcel.horizontal[ht],
    wrapText: luckyToExcel.wrapText[tb],
    textRotation: luckyToExcel.textRotation[tr],
  };

  return alignment;
};



const borderConvert = function (borderType: string, style: number = 1, color: string = '#000'): Partial<Excel.Borders> {
  if (!borderType) {
    return {};
  }

  const luckyToExcel: { [key: string]: any } = {
    type: {
      'border-all': 'all',
      'border-top': 'top',
      'border-right': 'right',
      'border-bottom': 'bottom',
      'border-left': 'left',
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick',
    },
  };

  const template = {
    style: luckyToExcel.style[style],
    color: { argb: color.replace('#', '') },
  };

  let border: Partial<Borders> = {};
  if (luckyToExcel.type[borderType] === 'all') {
    border = {
      top: template,
      right: template,
      bottom: template,
      left: template,
    };
  } else {
    border[luckyToExcel.type[borderType]] = template;
  }

  return border;
};

const addborderToCell = function (borders: { [key: string]: any }, row_index: number, col_index: number): Partial<Excel.Borders> {
  let border: Partial<Borders> = {};
  const luckyExcel: { [key: string]: string } = {
    l: 'left',
    r: 'right',
    b: 'bottom',
    t: 'top',
    };
    for (const key in borders) {
    border[luckyExcel[key]] = {
    style: borders[key].style,
    color: { argb: borders[key].color.replace('#', '') },
    };
    }
    return border;
    };
    
    const createCellPos = function (n: number): string {
    let ordA = 'A'.charCodeAt(0);
    let ordZ = 'Z'.charCodeAt(0);
    let len = ordZ - ordA + 1;
    let s = '';
    while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
    }
    return s;
};
export { exportExcel };