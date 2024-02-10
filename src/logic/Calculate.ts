export type MathError = "Math Error"

export const MathError: MathError = "Math Error"

export type Operand = number | MathError

export enum Operator {
    Plus,
    Minus,
    Times,
    Divide,
    Power,
}

export function Operand(number: number): Operand {
    if (isNaN(number) || number === Infinity || number === -Infinity) {
        return MathError
    }
    return number
}

export function parseOperand(value: string): Operand {
    return Operand(Number(value))
}

export default function calculate(
    operandA: Operand,
    operandB: Operand,
    operator: Operator,
): Operand {
    if (operandA === MathError || operandB === MathError) {
        return MathError
    }

    const result =
        operator === Operator.Plus ? operandA + operandB :
            operator === Operator.Minus ? operandA - operandB :
                operator === Operator.Times ? operandA * operandB :
                    operator === Operator.Divide ? operandA / operandB :
                        Math.pow(operandA, operandB)

    return Operand(result)
}