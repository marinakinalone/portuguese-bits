import { useNavigation } from '@react-navigation/native';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DELAY_MS, QuizzVariant, SCREENS } from '@/constants';
import { checkAnswer, translationTypeMapper } from '@/utils';
interface ITranslation {
  fr: string;
  pt: string;
}

type TranslationList = ITranslation[];

interface Result {
  questionNumber: number;
  isCorrect: boolean;
}

interface QuestionToReview {
  questionNumber: number;
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

export const QuizzProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [variant, setVariant] = useState<QuizzVariant | ''>('');
  const [input, setInput] = useState<string | ''>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<Result[]>([]);
  const [questionsToReview, setQuestionsToReview] = useState<
    QuestionToReview[]
  >([]);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigation = useNavigation();

  const { display, answer } = translationTypeMapper(variant);

  const wordToDisplay = wordsToTranslate[questionNumber]?.[display] || '';
  const correctAnswer = wordsToTranslate[questionNumber]?.[answer] || '';

  const handleCheckAnswer = () => {
    const isAnswerCorrect = checkAnswer(input, correctAnswer);
    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect) {
      setQuestionsToReview((prevQuestions) => [
        ...prevQuestions,
        { questionNumber },
      ]);
    }

    setResult((prevResult) => {
      const existingResultIndex = prevResult.findIndex(
        (r) => r.questionNumber === questionNumber,
      );

      if (existingResultIndex !== -1) {
        const updatedResult = [...prevResult];
        updatedResult[existingResultIndex].isCorrect = isAnswerCorrect;

        return updatedResult;
      } else {
        return [...prevResult, { questionNumber, isCorrect: isAnswerCorrect }];
      }
    });

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
    // TODO replace with wordsToTranslate.length - 1
    if (questionNumber < 2) {
      resetQuestion({ newQuestionNumber: questionNumber + 1 });
    } else {
      const nextQuestionToReview = questionsToReview.shift();
      if (nextQuestionToReview) {
        resetQuestion({
          newQuestionNumber: nextQuestionToReview.questionNumber,
        });
      } else {
        setIsNavigating(true);
        resetQuestion({ newQuestionNumber: 0 });
      }
    }
  };

  useEffect(() => {
    if (isNavigating) {
      navigation.navigate(SCREENS.SUCCESS);
      setResult([]);
      setIsNavigating(false);
    }
  }, [isNavigating, navigation]);

  useEffect(() => {
    if (
      // TODO replace with wordsToTranslate.length - 1
      result.length === 3 &&
      questionsToReview.length === 0
    ) {
      setTimeout(() => {
        setIsNavigating(true);
      }, DELAY_MS);
    }
  }, [result, questionsToReview]);

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
      }}
    >
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
