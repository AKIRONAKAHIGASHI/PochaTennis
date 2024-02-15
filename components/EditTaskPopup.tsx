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
  Divider, Textarea
} from '@chakra-ui/react';
import { Task } from '@/lib/types';
import { useToast } from '@chakra-ui/react';

interface EditTaskPopupProps {
  onClose: () => void;
  task: Task | undefined;
  onSave: (taskId: number, task: string) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ onClose, task, onSave }) => {
  const [content, setContent] = useState(task?.content || '');

  const toast = useToast();
  const initialRef = useRef(null);

  const modalBodyRef = useRef<HTMLDivElement>(null);



  const handleSave = () => {
    if (task) {
      onSave(task.id, content);
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
            <FormLabel>課題</FormLabel>
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