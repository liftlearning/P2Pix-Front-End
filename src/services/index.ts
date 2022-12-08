/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";

const defaultConfig = {
  "Content-Type": "application/json",
};

export const api = axios.create({
  ...defaultConfig,
  baseURL: "http://localhost:8000",
});
