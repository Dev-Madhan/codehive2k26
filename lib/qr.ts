import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: '#010E22',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
}

export function generateRegistrationNumber(): string {
  // Blueprint spec format: CH26-XXXXXX (e.g. CH26-8F3K21)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CH26-${randomPart}`;
}
