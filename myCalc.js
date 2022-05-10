const calc = function (num1, num2, o = 2) {// Calculate decimal equations
    const getDP = function (num) {// Return decimal places
        const numStr = num.toString();
        return (numStr.indexOf(".") === -1)
            ? 0
            : numStr.length - numStr.indexOf(".") - 1;
    };
    let num1Int = round(num1, 10), num2Int = round(num2, 10);//Make sure numbers are not too long for JS otherwise can NAN
    const num1DP = getDP(num1Int), num2DP = getDP(num2Int);
    num1Int = (o === 2)
        ? Number(num1Int + "e" + num1DP)
        : Number(num1Int + "e" + Math.max(num1DP, num2DP));
    num2Int = (o === 2)
        ? Number(num2Int + "e" + num2DP)
        : Number(num2Int + "e" + Math.max(num1DP, num2DP));
    switch (o) {
    case 0:// Addition
        return Number(num1Int + num2Int + "e-" + Math.max(num1DP, num2DP));
    case 1:// Subtraction
        return Number(`${num1Int - num2Int}e-${Math.max(num1DP, num2DP)}`);
    case 2:// Multiplication
        return Number(`${num1Int * num2Int}e-${num1DP + num2DP}`);
    case 3:// Division
        if (num1 === 0 || num2 === 0) {
            return 0;
        }
        return num1Int / num2Int;
    }
};

const round = function (num, places = 0) {// Round number
    return Number(Math.round(Number(num + "e" + places)) + "e-" + places);
};