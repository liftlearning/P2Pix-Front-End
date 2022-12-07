import qrcode from "qrcode";
import type { QRCodeToDataURLOptions } from "qrcode";
import { crc16ccitt } from "crc";
import type { Pix } from "@/model/Pix";

const pix = ({
  pixKey,
  merchantCity = "city",
  merchantName = "name",
  value,
  message,
  cep,
  transactionId = "***",
  currency = 986,
  countryCode = "BR",
}: Pix) => {
  const payloadKeyString = generatePixKey(pixKey, message);

  const payload: string[] = [
    formatEMV("00", "01"), //Payload Format Indicator
    formatEMV("26", payloadKeyString), // Merchant Account Information
    formatEMV("52", "0000"), //Merchant Category Code
    formatEMV("53", String(currency)), // Transaction Currency
  ];

  if (String(value) === "0") {
    value = undefined;
  }
  if (value) {
    payload.push(formatEMV("54", value.toFixed(2)));
  }

  payload.push(formatEMV("58", countryCode.toUpperCase())); // Country Code
  payload.push(formatEMV("59", merchantName)); // Merchant Name
  payload.push(formatEMV("60", merchantCity)); // Merchant City

  if (cep) {
    payload.push(formatEMV("61", cep)); // Postal Code
  }

  payload.push(formatEMV("62", formatEMV("05", transactionId))); // Additional Data Field Template

  payload.push("6304");

  const stringPayload = payload.join("");
  const crcResult = crc16ccitt(stringPayload)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");

  const payloadPIX = `${stringPayload}${crcResult}`;

  return {
    payload: (): string => payloadPIX,
    base64QrCode: (options?: QRCodeToDataURLOptions): Promise<string> =>
      qrcode.toDataURL(payloadPIX, options),
  };
};

const generatePixKey = (pixKey: string, message?: string): string => {
  const payload: string[] = [
    formatEMV("00", "BR.GOV.BCB.PIX"),
    formatEMV("01", pixKey),
  ];
  if (message) {
    payload.push(formatEMV("02", message));
  }
  return payload.join("");
};

const formatEMV = (id: string, param: string): string => {
  const len = param?.length?.toString().padStart(2, "0");
  return `${id}${len}${param}`;
};

export { pix };
