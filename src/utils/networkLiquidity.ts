const verifyNetworkLiquidity = (
  tokenValue: number,
  walletAddress: string,
  validDepositList: any[]
) => {
  const element = validDepositList.find((element) => {
    const remaining = element.remaining;
    if (
      tokenValue!! <= remaining &&
      tokenValue!! != 0 &&
      element.seller !== walletAddress
    ) {
      return true;
    }
    return false;
  });

  return element;
};

export { verifyNetworkLiquidity };
