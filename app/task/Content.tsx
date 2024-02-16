"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, VStack, IconButton, Text, Divider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Select, Spinner, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CalendarIcon } from '@chakra-ui/icons';
import TaskPopup from '@/components/TaskPopup';
import EditTaskPopup from '@/components/EditTaskPopup';
import { newTask, updateTask, deleteTask, fetchTasks } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const Task = () => {

    const router = useRouter();

    const [tasks, setTasks] = useState<Task[] | null>([]);

    const [isNewOpenPopup, setIsNewOpenPopup] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task>();

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false);
    const [deleteTaskId, setDeleteTaskId] = useState<number>(0);
    const cancelRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);


    const toast = useToast();


    const openPopup = () => {
        setIsNewOpenPopup(true);
    }

    const handleSaveNew = async (type: number, content: string) => {
        await newTask(type, content);
        fetchTasks().then(setTasks);
        setIsNewOpenPopup(false);
    };

    const openEditPopup = (task: Task) => {
        setEditTask(task);
        setIsEditPopupOpen(true);
    };

    const handleSaveEdit = async (taskId: number, type: number, content: string) => {
        await updateTask(taskId, type, content);
        fetchTasks().then(setTasks);
    };


    const openDeleteDialog = (id: number) => {
        setDeleteTaskId(id);
        setDeleteDialogIsOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogIsOpen(false);
        setDeleteTaskId(0);
    };

    const handleDeleteTask = async () => {
        if (deleteTaskId) {
            try {
                await deleteTask(deleteTaskId);
                fetchTasks().then(setTasks);
                closeDeleteDialog();
                toast({
                    title: '完了',
                    description: '課題が削除されました。',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            } catch (error) {
                console.error('削除エラー:', error);
            }
        }
    };

    const getTypeName = (type: number) => {
        switch (type) {
            case 0:
                return "全体";
            case 1:
                return "すず";
            case 2:
                return "まり";
            case 3:
                return "あきろー";
            default:
                return "不明";
        }
    };



    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            try {
                const loadedtasks = await fetchTasks();
                setTasks(loadedtasks);
            } catch (error) {
                console.error("課題の取得に失敗しました", error);
                setTasks(null);
            } finally {
                setIsLoading(false);
            }
        };


        fetchTask();
    }, []);

    return (
        <div className="polymorphic">
            <VStack spacing={4} align="stretch" bg="orange.100" overflowY="auto" h="100vh">
                <Box p={5}
                    m={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    bg="whiteAlpha.900"
                    position="sticky"
                    top="25"
                    zIndex="sticky">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>
                            課題一覧
                        </Text>
                        <Flex>
                            <IconButton
                                icon={<CalendarIcon />}
                                aria-label="スケジュール一覧"
                                onClick={() => { router.push('/schedule'); }}
                                background="transparent"
                                color={useColorModeValue('green.300', 'green.200')}
                                _hover={{ bg: "transparent" }}
                            />
                            <IconButton
                                icon={<AddIcon />}
                                aria-label="課題追加"
                                background="transparent"
                                color="orange.600"
                                _hover={{ bg: "transparent" }}
                                onClick={openPopup}
                            />
                        </Flex>
                    </Flex>
                </Box>
                {isLoading ? (
                    <Flex justify="center" align="center" minHeight="50vh">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                    </Flex>


                ) : tasks?.length === 0 ? (
                    <Box textAlign="center" p={5}>
                        <Text fontSize="lg" color="gray.600">課題がありません。</Text>
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch" w="100%" minHeight="100vh">
                        <Box p={5} mx={5} mb={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="whiteAlpha.700">
                            {tasks?.map((task, index) => (
                                <Box key={index}>
                                    <Box borderRadius="lg" p={4} position="relative" bg="gray.50" shadow="sm">
                                        <Box width="8px" height="100%" bg={'orange'} position="absolute" left={0} top={0} borderRadius="lg" />
                                        <Flex justifyContent="space-between">
                                            <Box mb={4} _hover={{ cursor: "pointer" }} onClick={() => openEditPopup(task)} pl={5}>
                                                <Text fontSize="sm" color="gray.500">{getTypeName(task.type)}</Text>
                                                <Text fontWeight="bold">{task.content}</Text>
                                            </Box>


                                            <IconButton
                                                aria-label="削除"
                                                icon={<DeleteIcon />}
                                                onClick={() => openDeleteDialog(task.id)}
                                                size="sm"
                                                background="transparent"
                                                color="red.500"
                                                _hover={{ bg: "gray.100" }}
                                            />
                                        </Flex>
                                    </Box>

                                    {index < tasks.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Box>

                    </VStack>
                )}
            </VStack>
            {isNewOpenPopup &&
                <TaskPopup
                    onClose={() => setIsNewOpenPopup(false)}
                    onSave={handleSaveNew}
                />}
            {isEditPopupOpen &&
                <EditTaskPopup
                    onClose={() => setIsEditPopupOpen(false)}
                    task={editTask}
                    onSave={handleSaveEdit}
                />
            }
            <AlertDialog
                isOpen={deleteDialogIsOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeDeleteDialog}
            >
                <AlertDialogOverlay bg="blackAlpha.600">
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            削除
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            この課題を削除してもよろしいですか？
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeDeleteDialog}>
                                キャンセル
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteTask} ml={3}>
                                削除
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default Task;
