import { useNavigation } from '@react-navigation/native';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  DELAY_MS,
  LANGUAGES,
  QUIZZ_VARIANTS,
  QuizzVariant,
  SCREENS,
} from '@/constants';

const { FR, PT } = LANGUAGES;
const { VERSION, THEME } = QUIZZ_VARIANTS;

interface ITranslation {
  fr: string;
  pt: string;
}

type TranslationList = ITranslation[];

interface Result {
  questionNumber: number;
  isCorrect: boolean;
}

interface QuizzContextProps {
  correctAnswer: string;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  input: string;
  isCorrect: boolean | null;
  questionNumber: number;
  result: Result[];
  setInput: (input: string) => void;
  setQuestionNumber: (number: number) => void;
  setVariant: (variant: QuizzVariant) => void;
  variant: QuizzVariant;
  wordToDisplay: string;
  wordsToTranslate: TranslationList;
}

const QuizzContext = createContext<QuizzContextProps | undefined>(undefined);

const wordsToTranslate: TranslationList = [
  { fr: 'Bonjour', pt: 'Olá' },
  { fr: 'Merci', pt: 'Obrigado' },
  { fr: 'Oui', pt: 'Sim' },
  { fr: 'Non', pt: 'Não' },
  { fr: `S'il vous plaît`, pt: 'Por favor' },
  { fr: 'Excusez-moi', pt: 'Desculpe' },
  { fr: 'Au revoir', pt: 'Tchau' },
  { fr: 'Comment ça va?', pt: 'Como vai?' },
  { fr: 'Je vais bien', pt: 'Estou bem' },
  { fr: 'Je ne comprends pas', pt: 'Não entendo' },
];

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const checkAnswer = (input: string, answer: string) => {
  const normalizedInput = removeAccents(input.toLowerCase());
  const normalizedAnswer = removeAccents(answer.toLowerCase());
  return normalizedInput === normalizedAnswer;
};

const translationTypeMapper = (variant: QuizzVariant) => {
  switch (variant) {
    case VERSION:
      return { display: PT, answer: FR };
    case THEME:
      return { display: FR, answer: PT };
    default:
      return { display: FR, answer: PT };
  }
};

export const QuizzProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [variant, setVariant] = useState<QuizzVariant | ''>('');
  const [input, setInput] = useState<string | ''>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<Result[] | []>([]);

  const navigation = useNavigation();

  const { display, answer } = translationTypeMapper(variant);

  const wordToDisplay = wordsToTranslate[questionNumber]?.[display] || '';
  const correctAnswer = wordsToTranslate[questionNumber]?.[answer] || '';

  const handleCheckAnswer = () => {
    const isAnswerCorrect = checkAnswer(input, correctAnswer);
    setIsCorrect(isAnswerCorrect);

    setResult((prevResult) => [
      ...prevResult,
      { questionNumber, isCorrect: isAnswerCorrect },
    ]);

    if (isAnswerCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, DELAY_MS);
    }
  };

  const resetQuestion = ({
    newQuestionNumber,
  }: {
    newQuestionNumber: number;
  }) => {
    setQuestionNumber(newQuestionNumber);
    setInput('');
    setIsCorrect(null);
  };

  const handleNextQuestion = () => {
    const newQuestionNumber = questionNumber + 1;

    // TODO change to wordsToTranslate.length
    if (newQuestionNumber >= 2) {
      navigation.navigate(SCREENS.SUCCESS);
      resetQuestion({ newQuestionNumber: 0 });
      setResult([]);
    } else {
      resetQuestion({ newQuestionNumber });
    }
  };

  return (
    <QuizzContext.Provider
      value={{
        correctAnswer,
        handleCheckAnswer,
        handleNextQuestion,
        input,
        isCorrect,
        questionNumber,
        result,
        setInput,
        setQuestionNumber,
        setVariant,
        variant,
        wordToDisplay,
        wordsToTranslate,
      }}>
      {children}
    </QuizzContext.Provider>
  );
};

export const useQuizzLogic = (): QuizzContextProps => {
  const context = useContext(QuizzContext);
  if (!context) {
    throw new Error('useQuizzLogic must be used within a QuizzProvider');
  }
  return context;
};
