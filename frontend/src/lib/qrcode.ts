import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateQRCodeCanvas = async (
  text: string,
  canvas: HTMLCanvasElement
): Promise<void> => {
  try {
    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateUpiQRCode = async (
  upiString: string
): Promise<string> => {
  return generateQRCode(upiString);
};

export const generateTableQRCode = async (
  tableToken: string,
  domain: string
): Promise<string> => {
  const url = `${domain}/s/${tableToken}`;
  return generateQRCode(url);
};
