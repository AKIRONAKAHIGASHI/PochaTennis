"use client";

import { Box, Flex, VStack, Text, IconButton, useColorModeValue } from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaBook } from "react-icons/fa";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import { useRouter } from "next/navigation";

const Movie: React.FC = () => {
    const router = useRouter();
    return (
        <div className="polymorphic">
            <VStack spacing={4} align="stretch" bg="orange.100" overflowY="auto" h="100dvh">
                <Box p={5} m={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="whiteAlpha.900" position="sticky" top="25" zIndex="sticky">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Youtube動画一覧</Text>
                        <Flex>
                            <IconButton
                                icon={<CalendarIcon />}
                                aria-label="スケジュール一覧"
                                onClick={() => {
                                    router.push("/schedule");
                                }}
                                background="transparent"
                                color={useColorModeValue("green.300", "green.200")}
                                _hover={{ bg: "transparent" }}
                            />
                            <IconButton
                                icon={<FaBook />}
                                aria-label="課題一覧"
                                onClick={() => {
                                    router.push("/task");
                                }}
                                background="transparent"
                                color={useColorModeValue("orange.300", "orange.200")}
                                _hover={{ bg: "transparent" }}
                            />
                        </Flex>
                    </Flex>
                </Box>

                <Box px="4" py="8">
                    <VStack spacing={8}>
                        <YoutubeEmbed title="ラスティシングルス練習会 ストロークラリー" embedId="dIJwsvvSeJE" />
                        <YoutubeEmbed title="ラスティシングルス練習会 ボレスト" embedId="0qxpPQN34-o" />
                        <YoutubeEmbed title="ラスティシングルス練習会 サーブレシーブ" embedId="QkTZT8O8-NE" />
                        <YoutubeEmbed title="ラスティシングルス練習会 試合形式" embedId="nMy1hs23WwI" />
                    </VStack>
                </Box>
            </VStack>
        </div>
    );
};

export default Movie;
