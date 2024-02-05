import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useDisclosure,
  Flex,
  Box,
  Text, RadioGroup, Radio, Stack, Divider
} from '@chakra-ui/react';
import { Schedule } from '@/lib/types';
import { useToast } from '@chakra-ui/react';
import { Member } from '@/lib/types';
import { fetchMembers } from '@/lib/supabase';
import MemberModal, { getBackgroundColor } from './MemberModal';
import { formatTime } from '../utils/format';

interface EditSchedulePopupProps {
  onClose: () => void;
  schedule: Schedule | undefined;
  onSave: (scheduleId: number, newTitle: string, newEventType: number, newStartTime: string, newEndTime: string, newMembers: Member[]) => void;
}

const EditSchedulePopup: React.FC<EditSchedulePopupProps> = ({ onClose, schedule, onSave }) => {
  const [title, setTitle] = useState(schedule?.title ?? '');
  const [startTime, setStartTime] = useState<Date | null>(schedule?.start_time ? new Date(schedule.start_time) : null);
  const [endTime, setEndTime] = useState<Date | null>(schedule?.end_time ? new Date(schedule.end_time) : null);
  const [eventType, setEventType] = useState('レンタル');

  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const { isOpen, onOpen, onClose: onMemberModalClose } = useDisclosure();
  const toast = useToast();
  const initialRef = useRef(null);

  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  useEffect(() => {

    if (schedule) {
      setTitle(schedule.title);
      setStartTime(schedule.start_time ? new Date(schedule.start_time) : null);
      setEndTime(schedule.end_time ? new Date(schedule.end_time) : null);
      setEventType(schedule.event_type === 1 ? 'レンタル' : '試合');
      setSelectedMembers(schedule.members);
    }

    const getMembers = async () => {
      const members = await fetchMembers();
      if (members) {
        setAvailableMembers(members);
      }
    };

    getMembers();
  }, [schedule]);

  const handleAddMember = (member: Member) => {
    setSelectedMembers([...selectedMembers, member]);
  };

  const handleRemoveMember = (member: Member) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
  };

  const handleConfirmSelection = (members: Member[]) => {
    setSelectedMembers(members);
    onMemberModalClose();

    if (modalBodyRef.current) {
      const lastElement = modalBodyRef.current.lastChild as HTMLElement;
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDateTimeChange = (setter: React.Dispatch<React.SetStateAction<Date | null>>, value: string) => {
    setter(new Date(value));
  };

  const formatTimeForServer = (date: Date | null): string => {
    if (!date) {
      return '';
    }
    let offset = (new Date()).getTimezoneOffset() * 60000; // タイムゾーンのオフセットをミリ秒で計算
    let localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16); // 秒以下を切り捨て
  };


  const handleSave = () => {
    if (schedule) {
      const eventTypeValue = eventType === 'レンタル' ? 1 : 2;
      const startTimeString = startTime ? formatTimeForServer(startTime) : '';
      const endTimeString = endTime ? formatTimeForServer(endTime) : '';
      onSave(schedule.id, title, eventTypeValue, startTimeString, endTimeString, selectedMembers);
      onClose();
      toast({
        title: '完了',
        description: 'スケジュールが更新されました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader ref={initialRef}>スケジュール編集</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody ref={modalBodyRef}>

          <FormControl>
            <FormLabel>タイトル</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>イベントタイプ</FormLabel>
            <RadioGroup onChange={(e) => setEventType(e)} value={eventType}>
              <Stack direction="row">
                <Radio value="レンタル">レンタル</Radio>
                <Radio value="試合">試合</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>開始時間</FormLabel>
            <Input
              textAlign="left"
              type="datetime-local"
              value={formatTime(startTime)}
              onChange={(e) => handleDateTimeChange(setStartTime, e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>終了時間</FormLabel>
            <Input
              textAlign="left"
              type="datetime-local"
              value={formatTime(endTime)}
              onChange={(e) => handleDateTimeChange(setEndTime, e.target.value)}
            />
          </FormControl>
          <FormControl my={8}>
            <Flex alignItems="center" justifyContent="space-between">
              <FormLabel mb="0">参加メンバー</FormLabel>
              <Button colorScheme="green" onClick={onOpen}>メンバー追加</Button>
            </Flex>
            <Flex wrap="wrap" mt={4}>
              {selectedMembers.map(member => (
                <Box key={member.id} p={2} m={1} fontWeight="bold" backgroundColor={getBackgroundColor(member.gender)} color="white" borderRadius="md" boxShadow="sm">
                  <Text fontSize="sm">{member.name}</Text>
                </Box>
              ))}
            </Flex>
          </FormControl>

        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSave} isDisabled={!schedule}>保存</Button>
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

export default EditSchedulePopup;