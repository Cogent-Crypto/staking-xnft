export const prettifyAddress: (string, int) => string = (address, chars = 4) => {
	return address.substring(0, chars) + "..." + address.substring(address.length - chars);
};
  