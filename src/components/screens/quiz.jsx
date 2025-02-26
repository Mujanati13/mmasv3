import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  message,
  Card,
  Button,
  Progress,
  Typography,
  Spin,
  Form,
  Input,
  Select,
  Radio,
  Space,
  Modal,
  Tabs,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  TrophyOutlined,
  ReloadOutlined,
  DownloadOutlined,
  RocketOutlined,
  BookOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Initialize the Generative AI SDK
const genAI = new GoogleGenerativeAI("AIzaSyAu3BGJ9pcUzNrkZg4anX-6FFshitnkLsE"); // Replace with your actual API key

const Quiz = () => {
  const quizRef = useRef(null);
  const pdfContentRef = useRef(null);
  const pdfQuestionsOnlyRef = useRef(null);
  const [form] = Form.useForm();
  const [quizState, setQuizState] = useState({
    questions: [],
    currentQuestion: 0,
    score: 0,
    showScore: false,
    loading: false,
    generating: false,
    error: null,
    selectedAnswer: null,
    isAnswerChecked: false,
    generationProgress: 0,
    loadingMessage: "Initialisation du questionnaire...",
    generatedQuestions: [],
  });

  const [quizParams, setQuizParams] = useState({
    level: "débutant",
    course: "",
    description: "",
    questionCount: 5,
  });

  const [showForm, setShowForm] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pdfType, setPdfType] = useState("complete");

  useEffect(() => {
    // Simulate progress when generating questions
    let progressInterval;
    if (quizState.generating) {
      progressInterval = setInterval(() => {
        setQuizState((prev) => {
          const newProgress = Math.min(prev.generationProgress + 2, 95);
          let loadingMessage = "Génération du questionnaire...";

          if (newProgress > 20 && newProgress <= 40) {
            loadingMessage = "Création des questions...";
          } else if (newProgress > 40 && newProgress <= 60) {
            loadingMessage = "Préparation des réponses...";
          } else if (newProgress > 60 && newProgress <= 80) {
            loadingMessage = "Ajout des explications...";
          } else if (newProgress > 80) {
            loadingMessage = "Finalisation...";
          }

          return {
            ...prev,
            generationProgress: newProgress,
            loadingMessage,
          };
        });
      }, 200);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [quizState.generating]);

  const generateQuizQuestions = async (values) => {
    setQuizState((prev) => ({
      ...prev,
      generating: true,
      error: null,
      generationProgress: 0,
    }));
    setQuizParams(values);

    try {
      // Using the Gemini model from Google Generative AI SDK
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a quiz about ${values.course} for ${values.level} level students with the following details: ${values.description}. 
            Generate ${values.questionCount} multiple-choice questions. 
            Format the response as a JSON array with each question object having: 
            {
                "question": "the question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "the correct option text",
                "explanation": "brief explanation why this is correct"
            }
            The response should be in French.
            Only respond with the JSON array, no other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Parse the response text as JSON
      let questionsData;
      try {
        // Find JSON part in the response (in case there's additional text)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questionsData = JSON.parse(jsonMatch[0]);
        } else {
          questionsData = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Échec d'analyse des données du quiz générées");
      }

      // Validate question format
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        throw new Error("Format de données de quiz invalide reçu");
      }

      // Show successful generation animation
      showGenerationSuccessAnimation(questionsData);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setQuizState((prev) => ({
        ...prev,
        generating: false,
        error: "Échec de génération des questions du quiz. Veuillez réessayer.",
      }));
      message.error("Échec de génération des questions du quiz");
    }
  };

  const showGenerationSuccessAnimation = (questionsData) => {
    // Complete the progress bar animation
    setQuizState((prev) => ({
      ...prev,
      generationProgress: 100,
      loadingMessage: "Quiz généré avec succès!",
    }));

    // Add a small delay to show 100% completion before moving on
    setTimeout(() => {
      // Show success animation for each question
      let questionIndex = 0;

      const animateQuestions = () => {
        if (questionIndex < questionsData.length) {
          setQuizState((prev) => ({
            ...prev,
            generatedQuestions: [
              ...prev.generatedQuestions,
              questionsData[questionIndex],
            ],
          }));

          questionIndex++;
          setTimeout(animateQuestions, 500); // Animate each question with a delay
        } else {
          // All questions animated, complete the process
          setTimeout(() => {
            setQuizState((prev) => ({
              ...prev,
              questions: questionsData,
              generating: false,
              loading: false,
              generatedQuestions: [],
            }));

            setShowForm(false);
            setFormSubmitted(true);

            message.success("Quiz généré avec succès !");
          }, 1000);
        }
      };

      // Start the question animation sequence
      animateQuestions();
    }, 1000);
  };

  const handleAnswerSelect = (selectedAnswer) => {
    if (quizState.isAnswerChecked) return;

    setQuizState((prev) => ({
      ...prev,
      selectedAnswer,
      isAnswerChecked: true,
    }));

    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      message.success("Réponse correcte !");
    } else {
      message.error("Réponse incorrecte !");
    }

    setTimeout(() => {
      setQuizState((prev) => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        currentQuestion: prev.currentQuestion + 1,
        showScore: prev.currentQuestion === prev.questions.length - 1,
        selectedAnswer: null,
        isAnswerChecked: false,
      }));
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      showScore: false,
      loading: false,
      generating: false,
      error: null,
      selectedAnswer: null,
      isAnswerChecked: false,
      generationProgress: 0,
      loadingMessage: "Initialisation du questionnaire...",
      generatedQuestions: [],
    });
    setShowForm(true);
    setFormSubmitted(false);
    form.resetFields();
  };

  const downloadQuizAsPDF = (type = "complete") => {
    setPdfType(type);
    setShowReviewModal(true);
  };

  const generatePDF = () => {
    const element =
      pdfType === "complete"
        ? pdfContentRef.current
        : pdfQuestionsOnlyRef.current;
    const filename =
      pdfType === "complete"
        ? `${quizParams.course}_${quizParams.level}_quiz_avec_reponses.pdf`
        : `${quizParams.course}_${quizParams.level}_quiz_questions.pdf`;

    const opt = {
      margin: 1,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    message.loading("Génération du PDF...");

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        message.success("PDF téléchargé avec succès !");
        setShowReviewModal(false);
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        message.error("Échec du téléchargement du PDF");
      });
  };

  if (quizState.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen p-4"
      >
        <Card className="w-full max-w-lg shadow-lg">
          <div className="text-center">
            <CloseCircleOutlined className="text-red-500 text-5xl mb-4" />
            <Title level={3}>Erreur</Title>
            <Text type="danger" className="text-lg">
              {quizState.error}
            </Text>
            <div className="mt-6">
              <Button type="primary" onClick={resetQuiz}>
                Réessayer
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen p-6 bg-gray-50"
      >
        <Card className="w-full max-w-xl shadow-lg">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BookOutlined className="text-blue-500 text-5xl mb-2" />
              <Title level={2}>Générateur de Quiz (AI)</Title>
              <Text className="text-gray-500">
                Créez un quiz personnalisé selon vos besoins
              </Text>
            </motion.div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={generateQuizQuestions}
            initialValues={quizParams}
          >
            <Form.Item
              name="level"
              label="Niveau de difficulté"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner un niveau de difficulté",
                },
              ]}
            >
              <Radio.Group buttonStyle="solid" className="w-full">
                <Space
                  direction="horizontal"
                  className="w-full flex justify-between"
                >
                  <Radio.Button value="débutant" className=" text-center">
                    Débutant
                  </Radio.Button>
                  <Radio.Button value="intermédiaire" className=" text-center">
                    Intermédiaire
                  </Radio.Button>
                  <Radio.Button value="avancé" className=" text-center">
                    Avancé
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="course"
              label="Sujet du cours"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le sujet du cours",
                },
              ]}
            >
              <Input
                prefix={<FormOutlined />}
                placeholder="ex., Les fondamentaux de Mathématiques"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description du quiz"
              rules={[
                { required: true, message: "Veuillez fournir une description" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Décrivez ce que ce quiz devrait couvrir, ex., 'Couvrir les concepts de base de JavaScript, y compris les variables, les fonctions et les objets.'"
              />
            </Form.Item>

            <Form.Item
              name="questionCount"
              label="Nombre de questions"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le nombre de questions",
                },
              ]}
            >
              <Select placeholder="Sélectionnez le nombre de questions">
                <Option value={5}>5 Questions</Option>
                <Option value={10}>10 Questions</Option>
                <Option value={15}>15 Questions</Option>
                <Option value={20}>20 Questions</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12"
                loading={quizState.generating}
                icon={<RocketOutlined />}
              >
                {quizState.generating
                  ? "Génération du quiz..."
                  : "Générer le Quiz"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    );
  }

  if (quizState.generating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {quizState.generatedQuestions.length === 0 ? (
          <>
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="text-6xl text-blue-500 mb-8"
            >
              <LoadingOutlined />
            </motion.div>
            <Title level={3}>Génération de Votre Quiz</Title>
            <Paragraph className="text-gray-500">
              {quizState.loadingMessage}
            </Paragraph>
            <div className="w-64 mt-6">
              <Progress
                percent={quizState.generationProgress}
                status="active"
                strokeColor="#1890ff"
              />
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg text-center"
          >
            <Title level={3}>Questions générées avec succès!</Title>
            <div className="mt-8 w-full">
              {quizState.generatedQuestions.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded flex items-center"
                >
                  <CheckCircleOutlined className="text-green-500 text-2xl mr-4" />
                  <Text>Question {index + 1} générée</Text>
                </motion.div>
              ))}
            </div>
            <Paragraph className="mt-6 text-gray-500">
              Préparation du quiz...
            </Paragraph>
          </motion.div>
        )}
      </div>
    );
  }

  if (quizState.showScore) {
    const scorePercentage =
      (quizState.score / quizState.questions.length) * 100;

    return (
      <div
        className="flex items-center justify-center min-h-screen p-4 bg-gray-50"
        ref={quizRef}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <TrophyOutlined className="text-6xl text-yellow-500 mb-4" />
            </motion.div>

            <Title level={2}>Quiz Terminé !</Title>
            <Paragraph>
              {quizParams.course} - Niveau{" "}
              {quizParams.level.charAt(0).toUpperCase() +
                quizParams.level.slice(1)}
            </Paragraph>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="my-8"
            >
              <Progress
                type="circle"
                percent={scorePercentage}
                format={() => (
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {quizState.score}/{quizState.questions.length}
                    </div>
                    <div className="text-sm">
                      {scorePercentage >= 70
                        ? "Excellent travail !"
                        : "Continuez à pratiquer !"}
                    </div>
                  </div>
                )}
                strokeWidth={10}
                strokeColor={
                  scorePercentage >= 80
                    ? "#52c41a"
                    : scorePercentage >= 60
                    ? "#1890ff"
                    : "#ff4d4f"
                }
              />

              <div className="mt-4">
                <Text>
                  {scorePercentage >= 80
                    ? "Excellent ! Vous maîtrisez ce sujet."
                    : scorePercentage >= 60
                    ? "Bon travail ! Vous avez une bonne compréhension."
                    : "Continuez à apprendre ! Vous vous améliorerez avec la pratique."}
                </Text>
              </div>
            </motion.div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={resetQuiz}
                className="min-w-32"
              >
                Créer un nouveau quiz
              </Button>

              <Button.Group className="min-w-32">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadQuizAsPDF("questions")}
                >
                  Questions
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadQuizAsPDF("complete")}
                  type="primary"
                >
                  Avec réponses
                </Button>
              </Button.Group>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen p-4 bg-gray-50"
        ref={quizRef}
      >
        <motion.div
          key={quizState.currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Text className="text-gray-500">
                  {quizParams.course} - Niveau{" "}
                  {quizParams.level.charAt(0).toUpperCase() +
                    quizParams.level.slice(1)}
                </Text>
                <Text strong>
                  Question {quizState.currentQuestion + 1}/
                  {quizState.questions.length}
                </Text>
              </div>
              <Progress
                percent={
                  (quizState.currentQuestion / quizState.questions.length) * 100
                }
                showInfo={false}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
            </div>

            <Title level={4} className="mb-6">
              {currentQuestion?.question}
            </Title>

            <div className="space-y-3">
              <AnimatePresence>
                {currentQuestion?.options.map((option, index) => {
                  const isSelected = quizState.selectedAnswer === option;
                  const isCorrect =
                    quizState.isAnswerChecked &&
                    option === currentQuestion.correctAnswer;
                  const isWrong =
                    quizState.isAnswerChecked && isSelected && !isCorrect;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        className={`w-full text-left p-3 h-auto flex items-start ${
                          isCorrect
                            ? "bg-green-50 border-green-500"
                            : isWrong
                            ? "bg-red-50 border-red-500"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={quizState.isAnswerChecked}
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex-shrink-0">
                            {isCorrect ? (
                              <CheckCircleOutlined className="text-green-500 text-xl" />
                            ) : isWrong ? (
                              <CloseCircleOutlined className="text-red-500 text-xl" />
                            ) : (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-gray-500">
                                {String.fromCharCode(65 + index)}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">{option}</div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {quizState.isAnswerChecked && currentQuestion?.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <Title level={5}>Explication:</Title>
                    <Paragraph>{currentQuestion.explanation}</Paragraph>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              <Button onClick={resetQuiz}>Annuler le quiz</Button>
              <Button.Group>
                <Button
                  onClick={() => downloadQuizAsPDF("questions")}
                  icon={<FileTextOutlined />}
                >
                  PDF Questions
                </Button>
                <Button
                  type="primary"
                  onClick={() => downloadQuizAsPDF("complete")}
                  icon={<FileDoneOutlined />}
                >
                  PDF Complet
                </Button>
              </Button.Group>
            </div>
          </Card>
        </motion.div>
      </div>

      <Modal
        title={
          <div className="flex items-center">
            {pdfType === "complete" ? (
              <FileDoneOutlined className="mr-2 text-blue-500" />
            ) : (
              <FileTextOutlined className="mr-2 text-blue-500" />
            )}
            <span>
              {pdfType === "complete"
                ? "Quiz avec Réponses"
                : "Quiz - Questions uniquement"}
            </span>
          </div>
        }
        open={showReviewModal}
        onOk={generatePDF}
        onCancel={() => setShowReviewModal(false)}
        width={800}
        okText="Télécharger PDF"
        cancelText="Annuler"
        className="quiz-review-modal"
      >
        <Tabs defaultActiveKey={pdfType} onChange={setPdfType}>
          <TabPane
            tab={
              <span>
                <FileTextOutlined /> Questions uniquement
              </span>
            }
            key="questions"
          >
            <div ref={pdfQuestionsOnlyRef} className="p-8">
              <div className="text-center mb-8">
                <Title level={2}>{quizParams.course}</Title>
                <Title level={4}>
                  Niveau:{" "}
                  {quizParams.level.charAt(0).toUpperCase() +
                    quizParams.level.slice(1)}
                </Title>
                <Paragraph>{quizParams.description}</Paragraph>
              </div>

              {quizState.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="mb-8 pb-6 border-b border-gray-200"
                >
                  <Title level={4} className="mb-4">
                    Question {qIndex + 1}: {question.question}
                  </Title>

                  <div className="ml-8 mb-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="mb-2 flex items-start">
                        <div className="mr-2 mt-1">
                          {String.fromCharCode(65 + oIndex)}.
                        </div>
                        <div>{option}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-8 text-center text-gray-500">
                <div>
                  Quiz généré le {new Date().toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileDoneOutlined /> Quiz complet avec réponses
              </span>
            }
            key="complete"
          >
            <div ref={pdfContentRef} className="p-8">
              <div className="text-center mb-8">
                <Title level={2}>{quizParams.course}</Title>
                <Title level={4}>
                  Niveau:{" "}
                  {quizParams.level.charAt(0).toUpperCase() +
                    quizParams.level.slice(1)}
                </Title>
                <Paragraph>{quizParams.description}</Paragraph>
              </div>

              {quizState.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="mb-8 pb-6 border-b border-gray-200"
                >
                  <Title level={4} className="mb-4">
                    Question {qIndex + 1}: {question.question}
                  </Title>

                  <div className="ml-8 mb-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="mb-2 flex items-start">
                        <div className="mr-2 mt-1">
                          {String.fromCharCode(65 + oIndex)}.
                        </div>
                        <div>{option}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                    <Text strong>Réponse correcte: </Text>
                    <Text>{question.correctAnswer}</Text>
                  </div>

                  <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <Text strong>Explication: </Text>
                    <Text>{question.explanation}</Text>
                  </div>
                </div>
              ))}

              <div className="mt-8 text-center text-gray-500">
                <div>
                  Quiz généré le {new Date().toLocaleDateString("fr-FR")}
                </div>
                <div>
                  Score: {quizState.score}/{quizState.questions.length} (
                  {(
                    (quizState.score / quizState.questions.length) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default Quiz;
