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
  ModalFooter,
  Button,
  Divider, Textarea, Select
} from '@chakra-ui/react';
import { Task } from '@/lib/types';
import { useToast } from '@chakra-ui/react';

interface EditTaskPopupProps {
  onClose: () => void;
  task: Task | undefined;
  onSave: (taskId: number, type: number, task: string) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ onClose, task, onSave }) => {
  const [content, setContent] = useState(task?.content || '');
  const [type, setType] = useState<number>(task?.type || 0);

  const toast = useToast();
  const initialRef = useRef(null);

  const modalBodyRef = useRef<HTMLDivElement>(null);



  const handleSave = () => {
    if (task) {
      onSave(task.id, type, content);
      onClose();
      toast({
        title: '完了',
        description: '課題が更新されました。',
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
        <ModalHeader ref={initialRef}>タスク編集</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody ref={modalBodyRef} maxHeight="60vh" overflowY="auto">
          <FormControl mt={4}>
            <FormLabel>ターゲット</FormLabel>
            <Select
              placeholder="タイプを選択"
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
            >
              <option value={0}>全員</option>
              <option value={1}>すず</option>
              <option value={2}>まり</option>
              <option value={3}>あきろー</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>内容</FormLabel>
            <Textarea
              placeholder="課題を入力"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>

        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSave} isDisabled={!task}>保存</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskPopup;