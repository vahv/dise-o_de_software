const operate = (() => {
    
    const add = (number1, number2) => {
        return number1+number2;
    }
    const subtract = (number1, number2) => {
        return number1-number2;
    }
    const multiply = (number1, number2) =>{
        return number1*number2;
    }
    const dividet = (number1, number2) => {
        if(number2 == 0) return 'Error';
        return number1/number2;
    }
    const performOperation = (operator,number1,number2) => {
        switch(operator){
            case "+":   return add(number1,number2);
            case "-":   return subtract(number1,number2);
            case "*":   return multiply(number1,number2);
            case "÷":   return dividet(number1,number2);
        }
    }

    return {performOperation};
})();

const displayFactory = (element)=>{
    const display = element;

    const addDigit = (digit) => {
        if(display.textContent == "0" && digit != ".")
        display.textContent = "";
        if(display.textContent == ".")
            if (display.textContent.includes(".")) ;
            else display.textContent = display.textContent+digit;
        else
        display.textContent = display.textContent+digit;
    }
    const deleteDigit= ()=>{
        let content = display.textContent.slice(0,display.textContent.length-1);
        display.textContent = content != "" ? content : "0";
    }

    const clearDisplay = () =>{
        display.textContent = "0";
    }

    const displayData = (string) => {
        display.textContent = string;
    }

    const getDisplayData = () => display.textContent;

    return {addDigit,clearDisplay,displayData, getDisplayData, deleteDigit};
};

const stateMachine = (() => {
    let currentState = "waitingForFirstNumber";
    const waitingForFirstNumber = () => {currentState = "waitingForFirstNumber"};
    const waitingForSecondNumber = () => {currentState = "waitingForSecondNumber"};
    const displayingResult = () => {currentState = "displayingResult"};
    const error = () => {currentState = "error"}; 
    const getState = () => currentState;
    const reset = () => currentState = waitingForFirstNumber();

    return {waitingForFirstNumber,waitingForSecondNumber,displayingResult,error,getState,reset}
})();

const calculator = (() => {
    let operator = "";
    let number1 = "";
    let number2 = "";
    
    const display = displayFactory(document.querySelector(".display>.main"));
    const subDisplay = displayFactory(document.querySelector(".display>.sub"));
    const getButtonType = (name) =>{
        switch(name){
            case "0" : case "1" : case "2" : case "3" : case "4" : case "5" :
                    case "6" : case "7" : case "8" : case "9" :
                        return "digit";
            case "*" : case "÷" : case "+" : case "-" :
                return "operator";
            case "." : return name;
            case "CE": return name;
            case "C": return name;
            case "DEL": return name;
            case "=" : return name;
        }
    }
    const onButtonClick = ( buttonValue ) => {
        switch(stateMachine.getState()){
            case "waitingForFirstNumber":
                switch(getButtonType(buttonValue)){
                    case "digit":
                    case ".":
                        display.addDigit(buttonValue);
                        break;
                    case "operator":
                        number1 = display.getDisplayData();
                        operator = buttonValue;
                        stateMachine.waitingForSecondNumber();
                        subDisplay.displayData(`${number1} ${operator}`);
                        display.clearDisplay();
                        break;
                        case "DEL":
                        display.deleteDigit();
                        break;
                        case "C":
                        display.clearDisplay();
                        break;
                        case "CE":
                        resetCalc();
                        break;
                    }
                break;
            case "waitingForSecondNumber":
                switch(getButtonType(buttonValue)){
                    case "digit":
                    case ".":
                        display.addDigit(buttonValue);
                        break;
                    case "operator":
                        number2 = display.getDisplayData();
                        number1 = operate.performOperation(operator,+number1,+number2);
                        operator = buttonValue;
                        subDisplay.displayData(`${number1} ${operator}`);
                        if(number1 === "Error") stateMachine.error();
                        else stateMachine.waitingForSecondNumber();
                        break;
                    case "=":
                        number2 = display.getDisplayData();
                        number1 = operate.performOperation(operator,+number1,+number2);
                        operator = "";
                        subDisplay.displayData(`${subDisplay.getDisplayData()} ${number2} =`);
                        display.displayData(number1);
                        if(number1 === "Error") stateMachine.error();
                        else stateMachine.displayingResult();
                    break;
                    case "DEL":
                        display.deleteDigit();
                        break;
                    case "C":
                        display.clearDisplay();
                        break;
                    case "CE":
                        resetCalc();
                        break;
                }
            break;
            case "displayingResult":
                switch(getButtonType(buttonValue)){
                    case "digit":
                        resetCalc();
                        display.addDigit(buttonValue);
                        break;
                    case "operator":
                        number1 = display.getDisplayData();
                        operator = buttonValue;
                        stateMachine.waitingForSecondNumber();
                        subDisplay.displayData(`${number1} ${operator}`);
                        display.clearDisplay();
                        break;
                    case "CE":
                        resetCalc();
                        break;
                }
            break;
            case "error":
            switch(getButtonType(buttonValue)){
                case "C":
                    resetCalc();
                    break;
                case "CE":
                    resetCalc();
                    break;
            }
            break;
    }
    };
    const resetCalc = () => {
        display.clearDisplay();
        subDisplay.displayData("");
        operator = "";
        number1 = "";
        number2 = "";
        stateMachine.waitingForFirstNumber();
    }
    return {onButtonClick};
})();

const buttonFactory = (element) => {
    const value = element.textContent;
    const onClick = () => {calculator.onButtonClick(value)};
    element.addEventListener("click", onClick);
    return {};
}

const buttons = document.querySelectorAll(".container>button");
buttons.forEach(button => buttonFactory(button));
