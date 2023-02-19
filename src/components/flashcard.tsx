import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import React from "react";
import useFitText from "use-fit-text";
import { ScriptFormatter } from "./script-formatter";
import { SetCreatorOnly } from "./set-creator-only";

export interface FlashcardProps {
  term: Term;
  isFlipped: boolean;
  index: number;
  numTerms: number;
  starred: boolean;
  h?: string;
  onPrev: () => void;
  onNext: () => void;
  onRequestEdit: () => void;
  onRequestStar: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  term,
  isFlipped,
  index,
  numTerms,
  starred,
  h = "500px",
  onPrev,
  onNext,
  onRequestEdit,
  onRequestStar,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const Star = starred ? IconStarFilled : IconStar;

  return (
    <Card w="full" h={h} rounded="xl" shadow="xl" overflow="hidden">
      <Box
        bg="orange.300"
        height="1"
        style={{
          visibility: !isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
      <Flex flexDir="column" h="full" p="8">
        <Grid templateColumns="1fr 1fr 1fr">
          <Text fontWeight={700} color="gray.500">
            {isFlipped ? "Definition" : "Term"}
          </Text>
          <Flex justifyContent="center">
            <Text fontWeight={700} fontSize="lg">
              {index + 1} / {numTerms}
            </Text>
          </Flex>
          <Flex justifyContent="end">
            <HStack spacing={2}>
              <SetCreatorOnly studySetId={term.studySetId}>
                <IconButton
                  icon={<IconEdit />}
                  aria-label="Edit"
                  rounded="full"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestEdit();
                  }}
                />
              </SetCreatorOnly>
              <IconButton
                icon={<Star />}
                aria-label="Star"
                rounded="full"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestStar();
                }}
              />
            </HStack>
          </Flex>
        </Grid>
        <Center flex={1} my="4" ref={containerRef} overflowY="auto">
          <PureShrinkableText
            text={isFlipped ? term.definition : term.word}
            container={containerRef}
          />
        </Center>
        <HStack spacing={4}>
          <Button
            w="full"
            size="lg"
            variant="outline"
            isDisabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <IconChevronLeft
              size="24"
              color={useColorModeValue("black", "white")}
            />
          </Button>
          <Button
            w="full"
            size="lg"
            variant="outline"
            isDisabled={index === numTerms - 1}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <IconChevronRight
              size="24"
              color={useColorModeValue("black", "white")}
            />
          </Button>
        </HStack>
      </Flex>
      <Box
        bg="orange.300"
        height="1"
        style={{
          visibility: isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
    </Card>
  );
};

const ShrinkableText: React.FC<{
  text: string;
  container: React.RefObject<HTMLDivElement>;
}> = ({ text, container }) => {
  const { fontSize, ref } = useFitText({
    minFontSize: 50,
  });

  return (
    <span
      ref={ref}
      style={{
        maxHeight: container.current
          ? `calc(${container.current.clientHeight}px)`
          : undefined,
        fontSize: (36 * parseFloat(fontSize.replace("%", ""))) / 100,
        fontWeight: 400,
        fontFamily: "Outfit",
        whiteSpace: "pre-wrap",
        display: "table-cell",
        verticalAlign: "middle",
        textAlign: "center",
      }}
    >
      <ScriptFormatter>{text}</ScriptFormatter>
    </span>
  );
};

const PureShrinkableText = React.memo(ShrinkableText);
