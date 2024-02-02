import {Button, GridItem, Icon, IconButton, Input, SimpleGrid} from "@chakra-ui/react";
import React, {useState} from "react";
import {ArrowBackIcon} from "@chakra-ui/icons";

enum KeyType {
    Primary,
    Secondary,
    Tertiary,
}

interface KeyProps {
    label: string,
    type: KeyType,
    span?: number,
    selected?: boolean,
    onClick: () => void
}

function Key({label, type, span, selected, onClick}: KeyProps) {
    return <GridItem colSpan={span ? span : 1}>
        <Button
            width="100%"
            onClick={onClick}
            colorScheme={
                type === KeyType.Primary ?
                    selected ? "green" : "teal" :
                    type === KeyType.Secondary ? "gray" :
                        "red"
            }
            size="lg"
        >
            {label}
        </Button>
    </GridItem>
}

enum Operand {
    A,
    B,
}

enum Operator {
    Plus,
    Minus,
    Times,
    Divide,
    Power,
}

export default function Calculator() {
    const [currentOperand, setCurrentOperand] = useState<Operand>(Operand.A)
    const [operandA, setOperandA] = useState("")
    const [operator, setOperator] = useState<Operator | undefined>(undefined)
    const [operandB, setOperandB] = useState<string | undefined>(undefined)
    const displayValue = currentOperand === Operand.A || operandB === undefined ?
        operandA : operandB

    function getOperand() {
        return currentOperand === Operand.A ? operandA : operandB
    }

    function getSetOperand() {
        return currentOperand === Operand.A ? setOperandA : setOperandB
    }

    function onClear() {
        setCurrentOperand(Operand.A)
        setOperandA("")
        setOperator(undefined)
        setOperandB(undefined)
    }

    function onNumberInput(number: number) {
        const operand = getOperand()
        const setOperand = getSetOperand()
        if (isNaN(Number(operand + number.toString())) || operand === "0" || operand === "-0") {
            setOperand(number.toString())
        } else {
            setOperand(operand + number.toString())
        }
    }

    function onDecimalPoint() {
        const operand = getOperand()
        const setOperand = getSetOperand()
        if (operand && !operand.includes(".") && operand !== "-") {
            setOperand(operand + ".")
        } else if (operand === "-") {
            setOperand("-0.")
        } else {
            setOperand("0.")
        }
    }

    function onOperatorSelect(operator: Operator) {
        if (currentOperand === Operand.B) {
            onEqualsClick()
        }
        if (operandA === "") {
            return
        }
        setOperator(operator)
        setCurrentOperand(Operand.B)
    }

    function onSignToggle() {
        const operand = getOperand()
        const setOperand = getSetOperand()
        if (operand !== undefined && operand.startsWith("-")) {
            setOperand(operand.substring(1))
        } else {
            if (operand !== undefined) {
                setOperand("-" + operand)
            } else {
                setOperand("-")
            }
        }
    }

    function onBackspace() {
        const operand = getOperand()
        const setOperand = getSetOperand()
        if (operand !== undefined && operand.length > 0 && operand !== "Infinity") {
            setOperand(operand.substring(0, operand.length - 1))
        } else {
            setOperand("")
        }
    }

    function onEqualsClick() {
        if (operandA === "" || operandB === undefined || operandB === "" || operator === undefined) {
            return
        }
        const operandAAsNumber = parseFloat(operandA)
        const operandBAsNumber = parseFloat(operandB)

        if (operator === Operator.Plus) {
            setOperandA((operandAAsNumber + operandBAsNumber).toString())
        } else if (operator === Operator.Minus) {
            setOperandA((operandAAsNumber - operandBAsNumber).toString())
        } else if (operator === Operator.Times) {
            setOperandA((operandAAsNumber * operandBAsNumber).toString())
        } else if (operator === Operator.Divide) {
            setOperandA((operandAAsNumber / operandBAsNumber).toString())
        } else if (operator === Operator.Power) {
            setOperandA((operandAAsNumber ** operandBAsNumber).toString())
        }

        setOperator(undefined)
        setOperandB(undefined)
        setCurrentOperand(Operand.A)
    }

    return (
        <SimpleGrid
            columns={4}
            width="60"
            spacing="2"
        >
            <GridItem colSpan={4}>
                <Input value={displayValue} textAlign="end" readOnly/>
            </GridItem>
            <Key
                label="AC"
                type={KeyType.Tertiary}
                onClick={() => {
                    onClear()
                }}
            />
            <Key
                label="±"
                type={KeyType.Primary}
                onClick={() => {
                    onSignToggle()
                }}
            />
            <Key
                label="^"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorSelect(Operator.Power)
                }}
                selected={operator === Operator.Power}
            />
            <Key
                label="÷"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorSelect(Operator.Divide)
                }}
                selected={operator === Operator.Divide}
            />
            <Key
                label="7"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(7)
                }}
            />
            <Key
                label="8"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(8)
                }}
            />
            <Key
                label="9"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(9)
                }}
            />
            <Key
                label="×"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorSelect(Operator.Times)
                }}
                selected={operator === Operator.Times}
            />
            <Key
                label="4"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(4)
                }}
            />
            <Key
                label="5"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(5)
                }}
            />
            <Key
                label="6"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(6)
                }}
            />
            <Key
                label="-"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorSelect(Operator.Minus)
                }}
                selected={operator === Operator.Minus}
            />
            <Key
                label="1"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(1)
                }}
            />
            <Key
                label="2"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(2)
                }}
            />
            <Key
                label="3"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(3)
                }}
            />
            <Key
                label="+"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorSelect(Operator.Plus)
                }}
                selected={operator === Operator.Plus}
            />
            <Key
                label="0"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberInput(0)
                }}
            />
            <Key
                label="."
                type={KeyType.Secondary}
                onClick={() => {
                    onDecimalPoint()
                }}
            />
            <IconButton
                aria-label="Backspace"
                icon={<ArrowBackIcon />}
                colorScheme="gray"
                size="lg"
                onClick={() => {
                    onBackspace()
                }}
            />
            <Key
                label="="
                type={KeyType.Primary}
                onClick={() => {
                    onEqualsClick()
                }}
            />
        </SimpleGrid>
    )
}