'use client'

import Calculator from "@/app/components/calculator";
import React from "react";
import {Center} from "@chakra-ui/react";

export default function Home() {
    return <Center height='calc(100vh)'>
        <Calculator/>
    </Center>
}
