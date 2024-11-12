import { useNavigation } from '@react-navigation/native';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DELAY_MS, QuizzVariant, SCREENS } from '@/constants';

interface ITranslation {
  fr: string;
  pt: string;
}

type TranslationList = ITranslation[];

interface QuizzContextProps {
  correctAnswer: string;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  input: string;
  isCorrect: boolean | null;
  isQuizzCompleted: boolean;
  questionNumber: number;
  setInput: (input: string) => void;
  setIsQuizzCompleted: (completed: boolean) => void;
  setQuestionNumber: (number: number) => void;
  variant: 'version' | 'theme';
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

export const QuizzProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  // TODO fix
  const [variant, setVariant] = useState<'version' | 'theme'>('version');
  const [isQuizzCompleted, setIsQuizzCompleted] = useState(false);
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const navigation = useNavigation();

  const wordToDisplay =
    variant === 'version'
      ? wordsToTranslate[questionNumber].pt
      : wordsToTranslate[questionNumber].fr;

  const correctAnswer =
    variant === 'version'
      ? wordsToTranslate[questionNumber].fr
      : wordsToTranslate[questionNumber].pt;

  const handleCheckAnswer = () => {
    const isAnswerCorrect = checkAnswer(input, correctAnswer);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, DELAY_MS);
    }
  };

  const handleNextQuestion = () => {
    const newQuestionNumber = questionNumber + 1;

    // TODO change to wordsToTranslate.length
    if (newQuestionNumber >= 2) {
      navigation.navigate(SCREENS.SUCCESS);
      setIsQuizzCompleted(true);
    } else {
      setQuestionNumber(newQuestionNumber);
      setInput('');
      setIsCorrect(null);
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
        isQuizzCompleted,
        questionNumber,
        setInput,
        setIsQuizzCompleted,
        setQuestionNumber,
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
