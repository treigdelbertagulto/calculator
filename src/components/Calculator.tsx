import {
    Button,
    Card,
    CardBody,
    Flex,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Input,
    SimpleGrid,
    Stack,
    useDisclosure
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {MdOutlineKeyboard} from "react-icons/md";
import ShortcutsModal from "./ShortcutsModal.tsx";
import calculate, {MathError, Operator, parseOperand} from "../logic/Calculate.ts";

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

export default function Calculator() {
    const [currentOperand, setCurrentOperand] = useState<Operand>(Operand.A)
    const [operandA, setOperandA] = useState("0")
    const [operator, setOperator] = useState<Operator | undefined>(undefined)
    const [operandB, setOperandB] = useState<string | undefined>(undefined)
    const displayValue = currentOperand === Operand.A || operandB === undefined ?
        operandA : operandB

    const {isOpen: showingShortcuts, onOpen: showShortcuts, onClose: hideShortcuts} = useDisclosure()

    function getOperand() {
        return currentOperand === Operand.A ? operandA : operandB
    }

    function getSetOperand() {
        return currentOperand === Operand.A ? setOperandA : setOperandB
    }

    function onClear() {
        setCurrentOperand(Operand.A)
        setOperandA("0")
        setOperator(undefined)
        setOperandB(undefined)
    }

    function onNumberInput(number: number) {
        const operand = getOperand()
        const setOperand = getSetOperand()

        if (parseOperand(operand + number.toString()) === MathError || operand === "0") {
            setOperand(number.toString())
        } else if (operand === "-0") {
            setOperand("-" + number.toString())
        } else {
            setOperand(operand + number.toString())
        }
    }

    function onDecimalPoint() {
        const operand = getOperand()
        const setOperand = getSetOperand()

        if (operand !== undefined) {
            if (parseOperand(operand) === MathError) {
                setOperand("0.")
            } else if (!operand.includes(".")) {
                setOperand(operand + ".")
            }
        }
    }

    function onSignToggle() {
        const operand = getOperand()
        const setOperand = getSetOperand()

        if (operand === undefined) {
            setOperand("-0")
        } else if (operand.startsWith("-")) {
            setOperand(operand.substring(1))
        } else {
            setOperand("-" + operand)
        }
    }

    function onOperatorSelect(newOperator: Operator) {
        let cancelOperator = parseOperand(operandA) === MathError
        if (currentOperand === Operand.B) {
            if (operandB !== undefined && operator !== undefined) {
                const result = calculate(
                    parseOperand(operandA),
                    parseOperand(operandB),
                    operator,
                )

                setOperandA(result.toString())

                setOperator(undefined)
                setOperandB(undefined)
                setCurrentOperand(Operand.A)

                cancelOperator = result === MathError
            }
        }
        if (!cancelOperator) {
            setOperator(newOperator)
            setCurrentOperand(Operand.B)
        }
    }

    function onBackspace() {
        const operand = getOperand()
        const setOperand = getSetOperand()

        function getBackspacedOperand() {
            const newOperand = operand?.substring(0, operand.length - 1) ?? "0"
            return newOperand === "" ? "0" : newOperand === "-" ? "-0" : newOperand
        }

        if (operand === undefined || parseOperand(operand) === MathError) {
            setOperand("0")
        } else {
            setOperand(getBackspacedOperand())
        }
    }

    function onEquals() {
        if (operandB === undefined || operator === undefined) {
            return
        }

        setOperandA(
            calculate(
                parseOperand(operandA),
                parseOperand(operandB),
                operator,
            ).toString()
        )

        setOperator(undefined)
        setOperandB(undefined)
        setCurrentOperand(Operand.A)
    }

    function onKeyUp(event: KeyboardEvent) {
        event.preventDefault()
        if (event.key === "Enter" || event.key === "=") {
            onEquals()
        } else if (event.key === "Backspace") {
            onBackspace()
        } else if (event.key === "Escape") {
            onClear()
        } else if (event.key === ".") {
            onDecimalPoint()
        } else if (event.key === "+") {
            onOperatorSelect(Operator.Plus)
        } else if (event.key === "-") {
            onOperatorSelect(Operator.Minus)
        } else if (event.key === "*") {
            onOperatorSelect(Operator.Times)
        } else if (event.key === "/") {
            onOperatorSelect(Operator.Divide)
        } else if (event.key === "^") {
            onOperatorSelect(Operator.Power)
        } else if (!isNaN(Number(event.key))) {
            onNumberInput(Number(event.key))
        } else if (event.key === "~") {
            onSignToggle()
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyUp);
        };
    });

    return (
        <>
            <Card variant="outline">
                <CardBody>
                    <Stack spacing={4}>
                        <Flex alignItems="center">
                            <Heading flexGrow={1} size="md">Calculator</Heading>
                            <IconButton aria-label="Shortcuts" onClick={showShortcuts}>
                                <Icon as={MdOutlineKeyboard}/>
                            </IconButton>
                        </Flex>
                        <SimpleGrid
                            columns={4}
                            width="60"
                            spacing={2}
                        >
                            <GridItem colSpan={4}>
                                <Input value={displayValue} textAlign="end" readOnly/>
                            </GridItem>
                            <Key
                                label="AC"
                                type={KeyType.Tertiary}
                                onClick={onClear}
                            />
                            <Key
                                label="±"
                                type={KeyType.Primary}
                                onClick={onSignToggle}
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
                                icon={<ArrowBackIcon/>}
                                colorScheme="gray"
                                size="lg"
                                onClick={onBackspace}
                            />
                            <Key
                                label="="
                                type={KeyType.Primary}
                                onClick={onEquals}
                            />
                        </SimpleGrid>
                    </Stack>
                </CardBody>
            </Card>

            <ShortcutsModal isOpen={showingShortcuts} onClose={hideShortcuts}/>
        </>
    )
}