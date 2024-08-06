function nubmerFormatter(number) {
  // Convert the number to a string
  let numberStr = number.toString();

  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = numberStr.split('.');

  // Reverse the integer part for easier processing
  let reversedInteger = integerPart.split('').reverse().join('');

  // Add commas after every 2nd digit from the right, except for the first group of 3 digits
  let parts = [];
  for (let i = 0; i < reversedInteger.length; i++) {
      if (i > 2 && (i - 1) % 2 === 0) {
          parts.push(',');
      }
      parts.push(reversedInteger[i]);
  }

  // Reverse again to restore the original order
  let formattedInteger = parts.reverse().join('');

  // Combine integer and decimal parts if there's a decimal part
  if (decimalPart) {
      return `${formattedInteger}.${decimalPart}`;
  } else {
      return formattedInteger;
  }
}

export default nubmerFormatter