import {Button, GridItem, Input, SimpleGrid} from "@chakra-ui/react";
import React, {useState} from "react";

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
            variant="solid"
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
    const [operandB, setOperandB] = useState("")
    const displayValue = currentOperand === Operand.A || operandB === "" ?
        operandA : operandB

    function onClear() {
        setCurrentOperand(Operand.A)
        setOperandA("")
        setOperator(undefined)
        setOperandB("")
    }

    function onNumberClick(number: number) {
        const operand = currentOperand === Operand.A ? operandA : operandB
        const setOperand = currentOperand === Operand.A ? setOperandA : setOperandB
        if (isNaN(operand)) {
            setOperand("")
        }
        setOperand(operand + number)
    }

    function onDecimalPointClick() {
        const operand = currentOperand === Operand.A ? operandA : operandB
        const setOperand = currentOperand === Operand.A ? setOperandA : setOperandB

        if (!operand.includes(".")) {
            setOperand(operand + ".")
        }
    }

    function onOperatorClick(operator: Operator) {
        if (currentOperand === Operand.B) {
            onEqualsClick()
        }
        if (operandA === "" || isNaN(Number(operandA)) || Number(operandA) === Infinity) {
            return
        }
        setOperator(operator)
        setCurrentOperand(Operand.B)
    }

    function onToggleSign() {
        const operand = currentOperand === Operand.A ? operandA : operandB
        const setOperand = currentOperand === Operand.A ? setOperandA : setOperandB

        if (operand.startsWith("-")) {
            setOperand(operand.substring(1))
        } else {
            setOperand("-" + operand)
        }
    }

    function onEqualsClick() {
        if (operandA === "" || operandB === "" ||
            isNaN(Number(operandA)) || isNaN(Number(operandB)) || operator === undefined) {
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
        setOperandB("")
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
                    onToggleSign()
                }}
            />
            <Key
                label="^"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorClick(Operator.Power)
                }}
                selected={operator === Operator.Power}
            />
            <Key
                label="÷"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorClick(Operator.Divide)
                }}
                selected={operator === Operator.Divide}
            />
            <Key
                label="7"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(7)
                }}
            />
            <Key
                label="8"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(8)
                }}
            />
            <Key
                label="9"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(9)
                }}
            />
            <Key
                label="×"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorClick(Operator.Times)
                }}
                selected={operator === Operator.Times}
            />
            <Key
                label="4"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(4)
                }}
            />
            <Key
                label="5"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(5)
                }}
            />
            <Key
                label="6"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(6)
                }}
            />
            <Key
                label="-"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorClick(Operator.Minus)
                }}
                selected={operator === Operator.Minus}
            />
            <Key
                label="1"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(1)
                }}
            />
            <Key
                label="2"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(2)
                }}
            />
            <Key
                label="3"
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(3)
                }}
            />
            <Key
                label="+"
                type={KeyType.Primary}
                onClick={() => {
                    onOperatorClick(Operator.Plus)
                }}
                selected={operator === Operator.Plus}
            />
            <Key
                label="0"
                span={2}
                type={KeyType.Secondary}
                onClick={() => {
                    onNumberClick(0)
                }}
            />
            <Key
                label="."
                type={KeyType.Secondary}
                onClick={() => {
                    onDecimalPointClick()
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