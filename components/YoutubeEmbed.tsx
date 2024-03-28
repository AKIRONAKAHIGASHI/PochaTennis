import { Box, Text } from "@chakra-ui/react";

interface YoutubeEmbedProps {
  embedId: string;
  title: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId, title }) => (
  <Box>
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    <Box pos="relative" paddingTop="56.25%" w="full" h="0">
      <iframe
        src={`https://www.youtube.com/embed/${embedId}`}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Embedded youtube"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  </Box>
);

export default YoutubeEmbed;
