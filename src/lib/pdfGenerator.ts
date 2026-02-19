import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { AddressData, LabelTemplate, SenderData } from '../types';
import { getLabelPosition } from './labelTemplates';

async function loadJapaneseFont(pdfDoc: PDFDocument, fontFamily: 'mincho' | 'gothic'): Promise<PDFFont> {
  pdfDoc.registerFontkit(fontkit);

  const fontUrl = fontFamily === 'mincho'
    ? 'https://fonts.gstatic.com/s/notoserifhk/v2/BngdUXBETWXI6LwlBZGcqL-B_KuJFNoGRv7f9w.ttf'
    : 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf';

  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  return await pdfDoc.embedFont(fontBytes);
}

export async function generatePDF(
  addresses: AddressData[],
  template: LabelTemplate,
  startPosition: number,
  offsetX: number,
  offsetY: number,
  includeSender: boolean,
  senderData: SenderData | null,
  fontFamily: 'mincho' | 'gothic'
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await loadJapaneseFont(pdfDoc, fontFamily);

  const totalPositions = addresses.length + startPosition - 1;
  const totalPages = Math.ceil(totalPositions / template.totalLabels);

  let addressIndex = 0;

  for (let page = 0; page < totalPages; page++) {
    const pdfPage = pdfDoc.addPage([595.28, 841.89]);

    for (let labelIndex = 0; labelIndex < template.totalLabels; labelIndex++) {
      const absolutePosition = page * template.totalLabels + labelIndex + 1;

      if (absolutePosition < startPosition) {
        continue;
      }

      if (addressIndex >= addresses.length) {
        break;
      }

      const address = addresses[addressIndex];
      addressIndex++;

      const { x, y } = getLabelPosition(template, labelIndex, offsetX, offsetY);

      await drawAddressLabel(
        pdfPage,
        font,
        address,
        x,
        y,
        template.labelWidth,
        template.labelHeight,
        includeSender,
        senderData
      );
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  link.download = `atena_label_${dateStr}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

async function drawAddressLabel(
  page: PDFPage,
  font: PDFFont,
  address: AddressData,
  x: number,
  y: number,
  width: number,
  height: number,
  includeSender: boolean,
  senderData: SenderData | null
): Promise<void> {
  const mmToPoints = 2.83465;
  const padding = 3;
  const contentX = (x + padding) * mmToPoints;
  const pageHeight = page.getHeight();
  const contentY = pageHeight - (y + padding) * mmToPoints;
  const contentWidth = (width - padding * 2) * mmToPoints;

  let currentY = contentY;

  if (address.addressLines.length > 0) {
    address.addressLines.forEach((line, index) => {
      if (line) {
        const fontSize = index === 0 && line.startsWith('〒') ? 9 : 10;
        const text = index === 0 && !line.startsWith('〒') && /^\d{3}-?\d{4}$/.test(line) ? `〒${line}` : line;

        const splitLines = splitText(text, contentWidth, font, fontSize);
        splitLines.forEach((splitLine) => {
          page.drawText(splitLine, {
            x: contentX,
            y: currentY,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          currentY -= (fontSize === 9 ? 5 : 4.5) * mmToPoints;
        });
      }
    });
  }

  if (address.recipientLines.length > 0) {
    currentY -= 2 * mmToPoints;

    if (address.recipientLineBreaks && address.recipientLineBreaks.length === address.recipientLines.length) {
      let currentPart = '';
      address.recipientLines.forEach((line, index) => {
        if (line) {
          currentPart += line;

          if (address.recipientLineBreaks![index] || index === address.recipientLines.length - 1) {
            const splitLines = splitRecipientText(currentPart, contentWidth, font, 12);
            splitLines.forEach((splitLine) => {
              page.drawText(splitLine, {
                x: contentX,
                y: currentY,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
              });
              currentY -= 5 * mmToPoints;
            });
            currentPart = '';
          }
        }
      });
    } else {
      const recipientText = address.recipientLines.filter(line => line).join('');
      if (recipientText) {
        const splitLines = splitRecipientText(recipientText, contentWidth, font, 12);
        splitLines.forEach((splitLine) => {
          page.drawText(splitLine, {
            x: contentX,
            y: currentY,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });
          currentY -= 5 * mmToPoints;
        });
      }
    }
  }

  if (includeSender && senderData && senderData.name) {
    const senderX = (x + width - padding) * mmToPoints;
    let senderY = pageHeight - (y + height - padding - 12) * mmToPoints;

    if (senderData.postalCode) {
      const postalText = `〒${senderData.postalCode}`;
      const textWidth = font.widthOfTextAtSize(postalText, 7);
      page.drawText(postalText, {
        x: senderX - textWidth,
        y: senderY,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      });
      senderY -= 3 * mmToPoints;
    }
    if (senderData.address) {
      const textWidth = font.widthOfTextAtSize(senderData.address, 7);
      page.drawText(senderData.address, {
        x: senderX - textWidth,
        y: senderY,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      });
      senderY -= 3 * mmToPoints;
    }
    if (senderData.name) {
      const textWidth = font.widthOfTextAtSize(senderData.name, 7);
      page.drawText(senderData.name, {
        x: senderX - textWidth,
        y: senderY,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
  }
}

function splitText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const chars = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  chars.forEach((char) => {
    const testLine = currentLine + char;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

function splitRecipientText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const textWidth = font.widthOfTextAtSize(text, fontSize);

  if (textWidth <= maxWidth) {
    return [text];
  }

  const honorifics = ['様', '御中', '殿'];
  const lines: string[] = [];

  for (const honorific of honorifics) {
    const index = text.lastIndexOf(honorific);
    if (index !== -1) {
      const beforeHonorific = text.substring(0, index);
      const withHonorific = text.substring(index);

      const beforeWidth = font.widthOfTextAtSize(beforeHonorific, fontSize);
      const afterWidth = font.widthOfTextAtSize(withHonorific, fontSize);

      if (beforeWidth <= maxWidth && afterWidth <= maxWidth) {
        return [beforeHonorific, withHonorific];
      }
    }
  }

  return splitText(text, maxWidth, font, fontSize);
}
