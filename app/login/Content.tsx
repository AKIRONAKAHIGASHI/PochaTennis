"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormControl, FormLabel, Input, Button, Box, useToast, Center, VStack, Select } from "@chakra-ui/react";

const Login = () => {
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "ログイン成功",
          description: "ログインに成功しました。",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.push("/schedule");
      } else {
        throw new Error(data.error || "ログインに失敗しました。");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "ログインエラー",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <Center h="100vh" backgroundColor="white">
      <Box w="100%" maxW="md" p={12}>
        <form onSubmit={login}>
          <VStack spacing={6}>
            <FormControl id="username">
              <FormLabel>ユーザ名</FormLabel>
              <Select placeholder="選択してください" value={username} onChange={(e) => setUsername(e.target.value)} borderWidth="2px" borderColor={"green.500"}>
                <option value="1">すず</option>
                <option value="2">まり</option>
                <option value="3">あき</option>
              </Select>
            </FormControl>
            <FormControl id="password">
              <FormLabel>パスワード</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} borderWidth="2px" borderColor={"green.500"} />
            </FormControl>
            <Button colorScheme="green" width="full" type="submit">
              ログイン
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default Login;
