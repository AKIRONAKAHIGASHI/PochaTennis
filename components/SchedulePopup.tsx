import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, ModalFooter, Button, useDisclosure, Flex, RadioGroup, Radio, Stack, Box, Text, Divider, Textarea } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import MemberModal, { getBackgroundColor } from './MemberModal';
import { Member } from '@/lib/types';
import { fetchMembers } from '@/lib/supabase';

interface SchedulePopupProps {
    onClose: () => void;
    onSave: (newTitle: string, eventType: number, startTime: string, endTime: string, members: Member[], remarks: string) => void;
};

const SchedulePopup: React.FC<SchedulePopupProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventType, setEventType] = useState('レンタル');
    const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const { isOpen, onOpen, onClose: onMemberModalClose } = useDisclosure();
    const [titleError, setTitleError] = useState('');
    const initialRef = useRef(null);
    const [remarks, setRemarks] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');


    const toast = useToast();

    useEffect(() => {
        const getMembers = async () => {
            const members = await fetchMembers();
            if (members) {
                setAvailableMembers(members);
            }
        };
        getMembers();
    }, []);

    const handleAddMember = (member: Member) => {
        setSelectedMembers([...selectedMembers, member]);
    };

    const handleRemoveMember = (member: Member) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    };

    const handleConfirmSelection = (members: Member[]) => {
        setSelectedMembers(members);
        onMemberModalClose();
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setTitleError('タイトルは入力必須です');
            return;
        }
        setTitleError('');

        if (!startTime.trim()) {
            setStartDateError('開始日時は入力必須です');
            return;
        }
        setStartDateError('');

        if (!endTime.trim()) {
            setEndDateError('終了日時は入力必須です');
            return;
        }
        setEndDateError('');

        try {
            const eventTypeValue = eventType === 'レンタル' ? 1 : 2; // '
            await onSave(title, eventTypeValue, startTime, endTime, selectedMembers, remarks);
            toast({
                title: '保存成功',
                description: 'スケジュールがデータベースに保存されました。',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            onClose();
        } catch (error) {
            console.error('保存エラー:', error);
            toast({
                title: '保存失敗',
                description: 'エラーが発生しました。',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="xl" initialFocusRef={initialRef}>
            <ModalOverlay />
            <ModalContent my={10} mx={5}>
                <ModalHeader ref={initialRef} >スケジュールを追加</ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody maxHeight="60vh" overflowY="auto">
                    <FormControl isInvalid={!!titleError}>
                        <FormLabel htmlFor="title-input">タイトル</FormLabel>
                        <Input id="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                        {titleError && <FormErrorMessage>{titleError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>イベントタイプ</FormLabel>
                        <RadioGroup onChange={setEventType} value={eventType}>
                            <Stack direction="row">
                                <Radio value="レンタル">レンタル</Radio>
                                <Radio value="試合">試合</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl mt={4} isInvalid={!!startDateError}>
                        <FormLabel htmlFor="starttime-input">開始時間</FormLabel>
                        <Input
                            id="starttime-input"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            onBlur={() => setStartDateError(!startTime.trim() ? '開始日時は入力必須です' : '')}
                        />
                        {startDateError && <FormErrorMessage>{startDateError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl mt={4} isInvalid={!!endDateError}>
                        <FormLabel htmlFor="endtime-input">終了時間</FormLabel>
                        <Input
                            id="endtime-input"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            onBlur={() => setEndDateError(!endTime.trim() ? '終了日時は入力必須です' : '')}
                        />
                        {endDateError && <FormErrorMessage>{endDateError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl my={8}>
                        <Flex alignItems="center" justifyContent="space-between">
                            <FormLabel htmlFor="member-input" mb="0">参加メンバー</FormLabel>
                            <Button id="member-input" colorScheme="green" onClick={onOpen}>メンバー追加</Button>
                        </Flex>
                        <Flex wrap="wrap" mt={4}>
                            {selectedMembers.map(member => (
                                <Box key={member.id} p={2} m={1} fontWeight="bold" backgroundColor={getBackgroundColor(member.gender)} color="white" borderRadius="md" boxShadow="sm">
                                    <Text fontSize="sm">{member.name}</Text>
                                </Box>
                            ))}
                        </Flex>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>備考</FormLabel>
                        <Textarea
                            placeholder="備考を入力"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <Divider />

                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={handleSave}>
                        保存
                    </Button>
                    <Button onClick={onClose}>閉じる</Button>
                </ModalFooter>
            </ModalContent>
            <MemberModal
                isOpen={isOpen}
                onClose={onMemberModalClose}
                availableMembers={availableMembers}
                selectedMembers={selectedMembers}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onConfirmSelection={handleConfirmSelection}
            />
        </Modal>
    );
};

export default SchedulePopup;
