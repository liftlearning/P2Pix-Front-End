import { parseEther } from "ethers/lib/utils";
import type { ValidDeposit } from "../ValidDeposit";

export const MockValidDeposits: ValidDeposit[] = [
  {
    blockNumber: 1,
    depositID: parseEther("1"),
    remaining: 70,
    seller: "mockedSellerAddress",
    pixKey: "123456789",
  },
  {
    blockNumber: 2,
    depositID: parseEther("2"),
    remaining: 200,
    seller: "mockedSellerAddress",
    pixKey: "123456789",
  },
  {
    blockNumber: 3,
    depositID: parseEther("3"),
    remaining: 1250,
    seller: "mockedSellerAddress",
    pixKey: "123456789",
  },
  {
    blockNumber: 4,
    depositID: parseEther("4"),
    remaining: 4000,
    seller: "mockedSellerAddress",
    pixKey: "123456789",
  },
  {
    blockNumber: 5,
    depositID: parseEther("5"),
    remaining: 2000,
    seller: "mockedSellerAddress",
    pixKey: "123456789",
  },
];
