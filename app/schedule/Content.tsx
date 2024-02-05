"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, VStack, IconButton, Text, Divider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Select, Spinner } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import SchedulePopup from '@/components/SchedulePopup';
import EditSchedulePopup from '@/components/EditSchedulePopup';
import { newSchedule, updateSchedule, deleteSchedule, fetchSchedulesWithMembers } from '@/lib/supabase';
import { Schedule } from '@/lib/types';
import { formatScheduleTime } from '../../utils/format';
import { useToast } from '@chakra-ui/react';
import { Member } from '@/lib/types';
import { WarningTwoIcon } from '@chakra-ui/icons';

const Schedule = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentYear(parseInt(event.target.value));
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentMonth(parseInt(event.target.value));
    };


    const [schedules, setSchedules] = useState<Schedule[] | null>([]);

    const [isNewOpenPopup, setIsNewOpenPopup] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editSchedule, setEditSchedule] = useState<Schedule>();

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false);
    const [deleteScheduleId, setDeleteScheduleId] = useState<number>(0);
    const cancelRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);


    const toast = useToast();


    const openPopup = () => {
        // setSelectedMembers([]);
        setIsNewOpenPopup(true);
        // setTemporarySelectedMembers([...selectedMembers]); // 現在の選択を一時的に保存
    }

    const handleSaveNew = async (newTitle: string, newEventType: number, startDate: string, endDate: string, selectedMembers: Member[]) => {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        await newSchedule(newTitle, newEventType, startDateTime, endDateTime, selectedMembers);
        fetchSchedulesWithMembers(currentYear, currentMonth).then(setSchedules);
        setIsNewOpenPopup(false);
    };

    const openEditPopup = (schedule: Schedule) => {
        console.log(schedule);
        setEditSchedule(schedule);
        setIsEditPopupOpen(true);
    };

    const handleSaveEdit = async (scheduleId: number, newTitle: string, newEventType: number, newStartTime: string, newEndTime: string, newMembers: Member[]) => {
        const startDateTime = new Date(newStartTime);
        const endDateTime = new Date(newEndTime);

        await updateSchedule(scheduleId, newTitle, newEventType, startDateTime, endDateTime, newMembers);

        fetchSchedulesWithMembers(currentYear, currentMonth).then(setSchedules);
    };


    const openDeleteDialog = (id: number) => {
        setDeleteScheduleId(id);
        setDeleteDialogIsOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogIsOpen(false);
        setDeleteScheduleId(0);
    };

    const handleDeleteSchedule = async () => {
        if (deleteScheduleId) {
            try {
                await deleteSchedule(deleteScheduleId);
                fetchSchedulesWithMembers(currentYear, currentMonth).then(setSchedules);
                closeDeleteDialog();
                toast({
                    title: '完了',
                    description: 'スケジュールが削除されました。',
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

    const createYearOptions = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => currentYear - i);
    };

    const createMonthOptions = () => {
        return Array.from({ length: 12 }, (_, i) => i + 1);
    };

    const getLabelColor = (eventType: number) => {
        switch (eventType) {
            case 1: // レンタル
                return "green.500";
            case 2: // 試合
                return "orange.500";
            default:
                return "gray.500";
        }
    };



    useEffect(() => {
        const fetchSchedules = async () => {
            setIsLoading(true);
            try {
                const loadedSchedules = await fetchSchedulesWithMembers(currentYear, currentMonth);
                setSchedules(loadedSchedules);
            } catch (error) {
                console.error("スケジュールの取得に失敗しました", error);
                setSchedules(null);
            } finally {
                setIsLoading(false);
            }
        };


        fetchSchedules();
    }, [currentYear, currentMonth]);

    return (
        <div className="polymorphic">
            <VStack spacing={4} align="stretch" bg="grass.100" overflowY="auto" h="100vh">
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
                        <Select onChange={handleYearChange} value={currentYear}>
                            {createYearOptions().map(year => (
                                <option key={year} value={year}>{year}年</option>
                            ))}
                        </Select>
                        <Select onChange={handleMonthChange} value={currentMonth} ml={2}>
                            {createMonthOptions().map(month => (
                                <option key={month} value={month}>{month}月</option>
                            ))}
                        </Select>
                        <IconButton
                            icon={<AddIcon />}
                            aria-label="スケジュール追加"
                            background="transparent"
                            color="green.600"
                            _hover={{ bg: "transparent" }}
                            onClick={openPopup}
                        />
                    </Flex>
                </Box>
                {isLoading ? (
                    <Flex justify="center" align="center" minHeight="50vh">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                    </Flex>


                ) : schedules?.length === 0 ? (
                    <Box textAlign="center" p={5}>
                        <Text fontSize="lg" color="gray.600">スケジュールがありません。</Text>
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch" w="100%" minHeight="100vh">
                        <Box p={5} mx={5} mb={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="whiteAlpha.700">
                            {schedules?.map((schedule, index) => (
                                <Box key={index}>
                                    <Box borderRadius="lg" p={4} position="relative" bg="gray.50" shadow="sm">
                                        {/* ラベル色を表示 */}
                                        <Box width="8px" height="100%" bg={getLabelColor(schedule.event_type)} position="absolute" left={0} top={0} borderRadius="lg" />

                                        {/* 日付表示 */}
                                        <Text fontWeight="bold" mb={2} ml={5} _hover={{ cursor: "pointer" }} onClick={() => openEditPopup(schedule)}>{formatScheduleTime(schedule?.start_time, schedule?.end_time)}</Text>

                                        {/* タイトル表示 */}
                                        <Box mb={4} _hover={{ cursor: "pointer" }} onClick={() => openEditPopup(schedule)} pl={5}>
                                            <Text fontWeight="bold">{schedule.title}</Text>
                                        </Box>

                                        <Flex justifyContent="space-between">
                                            {/* 参加者数を表示 */}
                                            <Flex alignItems="center" mt={2} pl={5} _hover={{ cursor: "pointer" }} onClick={() => openEditPopup(schedule)}>
                                                <Text fontWeight="bold" >
                                                    参加メンバー：
                                                </Text>
                                                {schedule.members && schedule.members.length <= 4 ? (
                                                    <Flex alignItems="center" ml={2}>
                                                        <Text fontWeight="bold" >{`${schedule.members.length}人`}</Text>
                                                        <WarningTwoIcon ml={1} color="red.500" />
                                                    </Flex>
                                                ) : (
                                                    <Text ml={2} fontWeight="bold" >{`${schedule.members?.length || 0}人`}</Text>
                                                )}
                                            </Flex>

                                            {/* 削除アイコン */}
                                            <IconButton
                                                aria-label="削除"
                                                icon={<DeleteIcon />}
                                                onClick={() => openDeleteDialog(schedule.id)}
                                                size="sm"
                                                background="transparent"
                                                color="red.500"
                                                _hover={{ bg: "gray.100" }}
                                            />
                                        </Flex>
                                    </Box>

                                    {index < schedules.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Box>

                    </VStack>
                )}
            </VStack>
            {isNewOpenPopup &&
                <SchedulePopup
                    onClose={() => setIsNewOpenPopup(false)}
                    onSave={handleSaveNew}
                />}
            {isEditPopupOpen &&
                <EditSchedulePopup
                    onClose={() => setIsEditPopupOpen(false)}
                    schedule={editSchedule}
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
                            このスケジュールを削除してもよろしいですか？
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeDeleteDialog}>
                                キャンセル
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteSchedule} ml={3}>
                                削除
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default Schedule;
