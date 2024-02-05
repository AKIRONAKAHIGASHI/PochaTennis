// components/CalendarComponent.tsx
import React from 'react';
import { Box, Text, SimpleGrid, Button } from '@chakra-ui/react';

interface CalendarComponentProps {
    onDateSelect: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelect }) => {
    return (
        <Box>
            <SimpleGrid columns={7} spacing={2}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <Button key={day} onClick={() => onDateSelect(new Date(2021, 8, day))}>
                        {day}
                    </Button>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default CalendarComponent;
