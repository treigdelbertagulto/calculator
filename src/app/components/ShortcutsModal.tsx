import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/modal";
import {Box, Button, Code, HStack, Text, VStack} from "@chakra-ui/react";

interface ShortcutProps {
    shortcut: string,
    label: string,
}

function Shortcut({shortcut, label}: ShortcutProps) {
    return <VStack alignItems="left">
        <HStack><Box width={20}><Code>{shortcut}</Code></Box><Text>{label}</Text></HStack>
    </VStack>
}

interface ShortcutsModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export default function ShortcutsModal(props: ShortcutsModalProps) {
    return <Modal {...props} isCentered>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Keyboard Controls</ModalHeader>
            <ModalBody>
                <Shortcut shortcut="Esc" label="Clear all"/>
                <Shortcut shortcut="Enter" label="Calculate"/>
                <Shortcut shortcut="=" label="Calculate"/>
                <Shortcut shortcut="~" label="Toggle sign"/>
                <Shortcut shortcut="0-9" label="Digits"/>
                <Shortcut shortcut="." label="Decimal point"/>
                <Shortcut shortcut="+-*/^" label="Operators"/>
            </ModalBody>
            <ModalFooter>
                <Button onClick={props.onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}