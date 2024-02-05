"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    useToast,
    Center,
    VStack
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const toast = useToast();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            toast({
                title: 'ログインエラー',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } else if (user) {
            router.push('/schedule');
        }
    };

    return (
        <Center h="100vh" backgroundColor="white" >
            <Box w="100%" maxW="md" p={12}>
                <form onSubmit={handleLogin}>
                    <VStack spacing={6}>
                        <FormControl id="email">
                            <FormLabel>メールアドレス</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} borderWidth="2px" borderColor={'green.500'} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>パスワード</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} borderWidth="2px" borderColor={'green.500'} />
                        </FormControl>
                        <Button colorScheme="green" width="full" type="submit">ログイン</Button>
                    </VStack>
                </form>
            </Box>
        </Center>
    );
}
